/**
 * @fileoverview
 * @author Mike Hergenrader
 * @version 1.0.0
 */

import PinkySwear, {
  PinkySwearMock, // TODO: mock implementation? (just need to be sure we can get access to state somehow of the class)
  PINKY_SWEAR_STATUSES,
  PINKY_SWEAR_ERROR_MESSAGES, // TODO: should I really be exporting these, or use the raw strings copied over?
} from '../src/PinkySwear';

describe('PinkySwear constructor', () => {
  it('throws an error if the argument is not a function', () => {
    const invalidParameterValues = [
      null,
      undefined,
      1,
      false,
      '',
      {},
      [],
    ];
    
    const expectedErrorMessage = 'A PinkySwear instance must receive an ' +
        'initializer function of the form (resolve, reject) => { ... }';

    // TOOD: any way to make this whole test just test one thing?
    // idea would be that we take these arrays out and essentially use them
    // to fuzz test/brute test this test function, which just takes in the
    // current argument, rather than expecting this test/it function to
    // handle the looping
    invalidParameterValues.forEach(invalidParameterValue => {
      expect(() => {
        new PinkySwear(invalidParameterValue);
      }).toThrow(expectedErrorMessage);
    });
  });

  it('returns a PinkySwear instance with a pending state if function ' +
      'argument does not resolve/reject synchronously', () => {
    const dummyPinkySwearInitializer = (resolve, reject) => {};

    // TODO: should we test the mock? or instead of subclass, do some sort
    // of mock object that intercepts and spies?
    const resultPinkySwear = new PinkySwearMock(dummyPinkySwearInitializer);

    const isPinkySwear = resultPinkySwear instanceof PinkySwear;
    const isPending = resultPinkySwear.isPending();
    const isFulfilled = resultPinkySwear.isFulfilled();
    const isRejected = resultPinkySwear.isRejected();

    // TODO: what about testing the value?

    expect(isPinkySwear).toBeTruthy();
    expect(isPending).toBeTruthy();
    expect(isFulfilled).not.toBeTruthy();
    expect(isRejected).not.toBeTruthy();
  });

  // TODO: lots of repeated code here - higher test abstraction?
  // across these various cases - we do the same setup and such - before?

  it('returns a PinkySwear instance with a fulfilled state if function ' +
      'argument fulfills the instance synchronously', () => {
    
    // This test does not care about what the chosen fulfillment value is,
    // only that the PinkySwear instance is now fulfilled. Thus, no value
    // is passed to the resolve call.
    const dummyPinkySwearInitializer = (resolve, reject) => {
      resolve();
    };

    // TODO: should we test the mock? or instead of subclass, do some sort
    // of mock object that intercepts and spies?
    const resultPinkySwear = new PinkySwearMock(dummyPinkySwearInitializer);

    const isPinkySwear = resultPinkySwear instanceof PinkySwear;
    const isPending = resultPinkySwear.isPending();
    const isFulfilled = resultPinkySwear.isFulfilled();
    const isRejected = resultPinkySwear.isRejected();

    expect(isPinkySwear).toBeTruthy();
    expect(isPending).not.toBeTruthy();
    expect(isFulfilled).toBeTruthy();
    expect(isRejected).not.toBeTruthy();    
  });

  it('returns a fulfilled PinkySwear instance with the initializer-chosen ' +
      'value if initializer fulfills the instance synchronously', () => {
    
    const dummyFulfillmentValue = 10;
    const dummyPinkySwearInitializer = (resolve, reject) => {
      resolve(dummyFulfillmentValue);
    };

    // TODO: could possibly make multiple cases here, though we could also
    // just change the dummyFulfillmentValue as well

    const resultPinkySwear = new PinkySwearMock(dummyPinkySwearInitializer);
    
    const resultPinkySwearValue = resultPinkySwear.getResolvedValue();
    expect(resultPinkySwearValue).toBe(dummyFulfillmentValue);
  });

  it('creates a PinkySwear instance with a rejected state if function ' +
      'argument rejects the instance synchronously', () => {
      
    // This test does not care about what the chosen rejection value is,
    // only that the PinkySwear instance is now rejected. Thus, no value
    // is passed to the resolve call.
    const dummyPinkySwearInitializer = (resolve, reject) => {
      reject();
    };

    // TODO: should we test the mock? or instead of subclass, do some sort
    // of mock object that intercepts and spies?
    const resultPinkySwear = new PinkySwearMock(dummyPinkySwearInitializer);

    const isPinkySwear = resultPinkySwear instanceof PinkySwear;
    const isPending = resultPinkySwear.isPending();
    const isFulfilled = resultPinkySwear.isFulfilled();
    const isRejected = resultPinkySwear.isRejected();

    expect(isPinkySwear).toBeTruthy();
    expect(isPending).not.toBeTruthy();
    expect(isFulfilled).not.toBeTruthy();
    expect(isRejected).toBeTruthy();    
  });

  it('creates a rejected PinkySwear instance with the initializer-chosen ' +
      'value if initializer rejects the instance synchronously', () => {
    
    const dummyRejectionValue = 10;
    const dummyPinkySwearInitializer = (resolve, reject) => {
      reject(dummyRejectionValue);
    };

    // TODO: could possibly make multiple cases here, though we could also
    // just change the dummyFulfillmentValue as well

    const resultPinkySwear = new PinkySwearMock(dummyPinkySwearInitializer);
    
    const resultPinkySwearValue = resultPinkySwear.getResolvedValue();
    expect(resultPinkySwearValue).toBe(dummyRejectionValue);
  });

  it('creates a pending PinkySwear instance if the initializer chosen ' +
      'fulfills or rejects asynchronously', () => {
    // Again: we don't care about the value here: only that the instance is still
    // pending. Thus, these can be passed directly to setTimeout.

    const asyncInitializers = [
      (resolve, reject) => {
        setTimeout(resolve, 0);
      },
      (resolve, reject) => {
        setTimeout(reject, 0);
      },
    ];

    // TODO: loops inside if statements also likely harder to debug: do we
    // know for certain which element we failed on from the TAP output?
    asyncInitializers.forEach(asyncInitializer => {
      const resultPinkySwear = new PinkySwearMock(asyncInitializer);

      const isPinkySwear = resultPinkySwear instanceof PinkySwear;
      const isPending = resultPinkySwear.isPending();
      const isFulfilled = resultPinkySwear.isFulfilled();
      const isRejected = resultPinkySwear.isRejected();

      expect(isPinkySwear).toBeTruthy();
      expect(isPending).toBeTruthy();
      expect(isFulfilled).not.toBeTruthy();
      expect(isRejected).not.toBeTruthy();
    });
  });

});

// TODO: test that only one status legal at at time? needed? (notice that
// we keep repeating the T, T, F checks, one per status type above) - this 
// would make it more generic

// TODO: need to link these back up to the fact that these are what
// resolve and reject are calling - that is, when resolve is called, we
// should have .hasBeenCalled expectations set for these functions (which
// we have bound as instance methods on the mock subclass)

describe('notifyFulfillment function', () => {
  it('sets a pending PinkySwear object to be fulfilled', () => {
    const doNothing = (resolve, reject) => {};
    const pinkySwear = new PinkySwearMock(doNothing);

    // Value not important - separate test for that.
    // TODO: what about testing to ensure that no matter what value we pass
    // in, this fulfilled status still holds? Would that be necessary?
    pinkySwear.notifyFulfillment();

    const isPending = pinkySwear.isPending();
    const isFulfilled = pinkySwear.isFulfilled();
    const isRejected = pinkySwear.isRejected();

    expect(isPending).not.toBeTruthy();
    expect(isFulfilled).toBeTruthy();
    expect(isRejected).not.toBeTruthy();
  });

  it('sets a pending PinkySwear object value to the argument fulfillment value',
      () => {
    const doNothing = (resolve, reject) => {};
    const pinkySwear = new PinkySwearMock(doNothing);
    const dummyFulfillmentValue = 10;

    pinkySwear.notifyFulfillment(dummyFulfillmentValue);
    const pinkySwearValue = pinkySwear.getResolvedValue();

    expect(pinkySwearValue).toBe(dummyFulfillmentValue);
  });

  it('is idempotent', () => {
    const expectedFulfillmentValue = 0;
    const numTimesToNotifyFulfill = 3;

    const fulfillMultipleTimes = (resolve, reject) => {
      for (let i = 0; i < numTimesToNotifyFulfill; i++) {
        resolve(i);
      }
      // TODO: also insert an async call here? (need async gates around this
      // test)
    };

    const pinkySwear = new PinkySwearMock(fulfillMultipleTimes);

    // Testing both here for the definition of idempotent: happens exactly
    // once, regardless of how many times called. The "exactly once"
    // expectation is that the PinkySwear goes from Pending to Fulfilled and
    // that the result value is the first one.
    const pinkySwearResolvedValue = pinkySwear.getResolvedValue();
    expect(pinkySwearResolvedValue).toBe(expectedFulfillmentValue);
    
    const pinkySwearResolvedStatus = pinkySwear.getResolvedStatus();
    const isPending = pinkySwear.isPending();
    const isFulfilled = pinkySwear.isFulfilled();
    const isRejected = pinkySwear.isRejected();

    expect(isPending).not.toBeTruthy();
    expect(isFulfilled).toBeTruthy();
    expect(isRejected).not.toBeTruthy();
  });

  // The idempotent test checks the resolved -> resolved -> resolved -> ...
  // So this test rounds out the final check of: rejected -> resolved.
  // This test could be expanded out in the future if a PinkySwear had another
  // status type (e.g. cancelled).
  // Together, this test and the previous one assert that only pending
  // PinkySwear object are affected by this method.
  it('does nothing if a PinkySwear object is already rejected', () => {
    const rejectionValue = 10;
    const fulfillmentValue = 20;
    const rejectThenFulfillImmediately = (resolve, reject) => {
      reject(rejectionValue);
      resolve(fulfillmentValue);
    };

    const pinkySwear = new PinkySwearMock(rejectThenFulfillImmediately);

    const pinkySwearValue = pinkySwear.getResolvedValue();
    expect(pinkySwearValue).toBe(rejectionValue);
    
    const pinkySwearResolvedStatus = pinkySwear.getResolvedStatus();
    const isPending = pinkySwear.isPending();
    const isFulfilled = pinkySwear.isFulfilled();
    const isRejected = pinkySwear.isRejected();

    expect(isPending).not.toBeTruthy();
    expect(isFulfilled).not.toBeTruthy();
    expect(isRejected).toBeTruthy();
  });
});

describe('notifyRejection function', () => {
  it('sets a pending PinkySwear object to be rejected', () => {
    const doNothing = (resolve, reject) => {};
    const pinkySwear = new PinkySwearMock(doNothing);

    // Value not important - separate test for that.
    // TODO: what about testing to ensure that no matter what value we pass
    // in, this fulfilled status still holds? Would that be necessary?
    pinkySwear.notifyRejection();

    const isPending = pinkySwear.isPending();
    const isFulfilled = pinkySwear.isFulfilled();
    const isRejected = pinkySwear.isRejected();

    expect(isPending).not.toBeTruthy();
    expect(isFulfilled).not.toBeTruthy();
    expect(isRejected).toBeTruthy();
  });

  it('sets a pending PinkySwear object value to the argument rejection value',
      () => {
    const doNothing = (resolve, reject) => {};
    const pinkySwear = new PinkySwearMock(doNothing);
    const dummyRejectionValue = 10;

    pinkySwear.notifyRejection(dummyRejectionValue);
    const pinkySwearValue = pinkySwear.getResolvedValue();

    expect(pinkySwearValue).toBe(dummyRejectionValue);
  });

  it('is idempotent', () => {
    const expectedRejectionValue = 0;
    const numTimesToNotifyRejection = 3;

    const rejectMultipleTimes = (resolve, reject) => {
      for (let i = 0; i < numTimesToNotifyRejection; i++) {
        reject(i);
      }
      // TODO: also insert an async call here? (need async gates around this
      // test)
    };

    const pinkySwear = new PinkySwearMock(rejectMultipleTimes);

    // Testing both here for the definition of idempotent: happens exactly
    // once, regardless of how many times called. The "exactly once"
    // expectation is that the PinkySwear goes from Pending to Fulfilled and
    // that the result value is the first one.
    const pinkySwearRejectedValue = pinkySwear.getResolvedValue();
    expect(pinkySwearRejectedValue).toBe(expectedRejectionValue);
    
    const pinkySwearResolvedStatus = pinkySwear.getResolvedStatus();
    const isPending = pinkySwear.isPending();
    const isFulfilled = pinkySwear.isFulfilled();
    const isRejected = pinkySwear.isRejected();

    expect(isPending).not.toBeTruthy();
    expect(isFulfilled).not.toBeTruthy();
    expect(isRejected).toBeTruthy();
  });

  // The idempotent test checks the rejected -> rejected -> rejected -> ...
  // So this test rounds out the final check of: resolved -> rejected.
  // This test could be expanded out in the future if a PinkySwear had another
  // status type (e.g. cancelled).
  // Together, this test and the previous one assert that only pending
  // PinkySwear object are affected by this method.
  it('does nothing if a PinkySwear object is already fulfilled', () => {
    const rejectionValue = 10;
    const fulfillmentValue = 20;

    const fulfillThenRejectImmediately = (resolve, reject) => {
      resolve(fulfillmentValue);
      reject(rejectionValue);
    };

    const pinkySwear = new PinkySwearMock(fulfillThenRejectImmediately);

    const pinkySwearValue = pinkySwear.getResolvedValue();
    expect(pinkySwearValue).toBe(fulfillmentValue);
    
    const pinkySwearResolvedStatus = pinkySwear.getResolvedStatus();
    const isPending = pinkySwear.isPending();
    const isFulfilled = pinkySwear.isFulfilled();
    const isRejected = pinkySwear.isRejected();

    expect(isPending).not.toBeTruthy();
    expect(isFulfilled).toBeTruthy();
    expect(isRejected).not.toBeTruthy();
  });
});





// TODO: what about when you pass in a rejected promise to promise.resolve?

// TODO: should add to the test/another test looking at the internal data
// fulfilled, and then its value
describe('PinkySwear static API wrapper methods', () => {
  describe('PinkySwear.resolve method', () => {
    it('returns a new fulfilled PinkySwear instance for any argument that is ' +
        'not a PinkySwear instance', () => {
      const inputValues = [
        undefined,
        null,
        0,
        1,
        Infinity,
        NaN,
        {},
        {
          a: 10,
        },
        [1, 2, 3],
        new Error('Test error'),
        'Test string',
      ];

      inputValues.forEach(inputValue => {
        const resultValue = PinkySwear.resolve(inputValue);
        const resultIsPinkySwear = resultValue instanceof PinkySwear;

        expect(resultIsPinkySwear).toBeTruthy();
      });
    });

    it('returns back the same PinkySwear instance', () => {
      const nonPinkySwearValue = 10;

      const inputPinkySwear = PinkySwear.resolve(nonPinkySwearValue);
      const resultPinkySwear = PinkySwear.resolve(inputPinkySwear);

      expect(resultPinkySwear).toBe(inputPinkySwear);
    });

    // TODO: thenables, etc.
  });

  describe('PinkySwear.reject method', () => {

  });
});

describe('PinkySwear instance methods', () => {

  describe('then method', () => {
    it('must receive a callback function as its argument', () => {

    });

    it('returns a new PinkySwear instance ', () => {

    });

    it('returns a unique PinkySwear instance when called multiple times',
        () => {
      
    });

    it('is called immediately for an already fulfilled PinkySwear instance',
        () => {
    });

    it('is not called for a rejected PinkySwear instance', () => {

    });


  });

  describe('catch method', () => {

  });

  describe('toString method', () => {

  });



});

describe('PinkySwear Static API Methods', () => {
  

  describe('PinkySwear.all method', () => {

  });

  describe('PinkySwear.any method', () => {

  });
});