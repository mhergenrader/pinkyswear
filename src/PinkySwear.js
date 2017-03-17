/**
 * @fileoverview
 * @author Mike Hergenrader
 * @version 1.0.0
 */

export const PINKY_SWEAR_ERROR_MESSAGES = {
  INVALID_SETUP_CALLBACK: 'A PinkySwear instance must receive an ' +
      'initializer function of the form (resolve, reject) => { ... }',
  
};

export const PINKY_SWEAR_STATUSES = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
};

// TODO: how to get inner instance state of a class for testing?
// first idea used here: subclass the class to just read up into it
// but we may need to do a few quick tests on subclass as well - any better
// way to do this?
// technically, the state isn't private to the instance...

// decided to make these private methods to the module

// TODO: how to specify that "this" is bound? any tags? is it needed to
// be specified? (jsdoc)
// these two are internal callback functions that can be invoked by the
// user setupResolutionCallback function passed in - this is how we signal
// that a promise should change its status


// TODO: how do we test these, however?

/**
 * 
 * @param {fulfillmentValue}
 */
const notifyFulfillment = function(fulfillmentValue) {
  if (this.resolvedStatus != PINKY_SWEAR_STATUSES.PENDING) {
    return;
  }

  this.resolvedStatus = PINKY_SWEAR_STATUSES.FULFILLED;
  this.resolvedValue = fulfillmentValue;


};

/**
 * 
 * @param {rejectionValue}
 */
const notifyRejection = function(rejectionValue) {
  if (this.resolvedStatus != PINKY_SWEAR_STATUSES.PENDING) {
    return;
  }

  this.resolvedStatus = PINKY_SWEAR_STATUSES.REJECTED;
  this.resolvedValue = rejectionValue;


};


/**
 * 
 */
class PinkySwear {
  resolvedStatus = PINKY_SWEAR_STATUSES.PENDING;
  resolvedValue = undefined;

  constructor(setupResolutionCallback) {
    if (typeof setupResolutionCallback != 'function') {
      throw new Error(PINKY_SWEAR_ERROR_MESSAGES.INVALID_SETUP_CALLBACK);
    }

    setupResolutionCallback.call(
        this, notifyFulfillment.bind(this), notifyRejection.bind(this));
  }

  



  // Static API wrapper methods

  /**
   * 
   */
  static resolve(value) {
    if (value instanceof PinkySwear) {
      return value; // TODO: what about checks for if the value is rejected?
    }

    return new PinkySwear((resolve, reject) => {
      resolve(value);
    });
  }

  /**
   * 
   */
  static reject(errorValue) {
    return new PinkySwear((resolve, reject) => {
      reject(errorValue);
    });
  }

  // Static API compose methods

  static all(...pinkySwears) {

  }

  static any(...pinkySwears) {

  }

}

// TODO: make this a superclass instead?
// but we don't want to modify the inheritance tree of the (base) class
// under test here...

/**
 * Mock subclass that allows getting access to parent state without parent
 * needing to provide these getter methods
 */
export class PinkySwearMock extends PinkySwear {
  constructor(setupResolutionCallback) {
    super(setupResolutionCallback);

    // Exposing these module-private functions so that they can be tested
    // TODO: is this a good idea?
    this.notifyFulfillment = notifyFulfillment.bind(this);
    this.notifyRejection = notifyRejection.bind(this);
  }


  getResolvedStatus() {
    return this.resolvedStatus;
  }  

  // Need to refer to this explicitly, since we may be calling these
  isPending() {
    return PinkySwearMock.prototype.getResolvedStatus.call(this) ===
        PINKY_SWEAR_STATUSES.PENDING;
  }

  isFulfilled() {
    return PinkySwearMock.prototype.getResolvedStatus.call(this) ===
        PINKY_SWEAR_STATUSES.FULFILLED;
  }

  isRejected() {
    return PinkySwearMock.prototype.getResolvedStatus.call(this) ===
        PINKY_SWEAR_STATUSES.REJECTED;
  }

  getResolvedValue() {
    return this.resolvedValue;
  }

}


export default PinkySwear;
