class CallbackAction{
  constructor(cb){
    this.cb = cb;
  }
  callback(){
    this.cb();
  }
}

function isAsyncAction(val){
  return val && typeof val.async === 'function' && val.async.length === 2;
}

function isCallbackAction(val){
  return val instanceof CallbackAction;
}

function isCollectionAction(val){
  return val instanceof ActionCollection;
}

function isPromiseAction(val) {
  return val && typeof val.then === 'function';
}

function isPureAction(val) {
  return val && val.type !== undefined;
}

class ActionCollection {
  constructor(actions){
    this.actions = actions; 
  }
  catch(fn){
    this.catchFn = fn;
    return this;
  }
  addAction(action){
    this.actions.push(action)
    return this;
  }
  add(action){
    this.addAction(action)
  }
  doAll(dispatch){
    var that = this
    const catchFn = (action) => {
      return (typeof that.catchFn === 'function')?
        that.catchFn(action):dispatch(action)
    }

    var allActions = this.actions.map((action) => {
      if(isCollectionAction(action)){
        // for collection action, append next sibling action to the actions list and dispatch
        return (next, catchFn) => {
          action
            .addAction(new CallbackAction(next))
            .catch(catchFn)
            .doAll(dispatch)          
        }
      } else if(isPureAction(action)) {
        // pure action is dispatch as normal and never cause catching
        return (next, catchFn) => {
          dispatch(action);
          next();
        }
      } else if (isPromiseAction(action)) {
        // promise action is adopted to a collection action with 2 child actions: 
        // the promise fullfilled value and the next action callback
        return (next, catchFn) => {
          action.then((action) => {
            dispatch(ActionCollection.actions([
              action,
              new CallbackAction(next)
            ]).catch(catchFn))
          }, catchFn)
        }
      } else if (isCallbackAction(action)) {
        // callback action is for flow controlling purpose, should be used by middleware only. 
        // It is use as a wrapper action for the next action in flow
        return (next, catchFn) => {
          action.callback();
        }
      } else if (isAsyncAction(action)) {
        // consider as another variant of promise action. The asyn action is an object with property async as 
        // a function with 2 parameters: callback for success case and callback for fail cases
        return (next, catchFn) => {
          action((action) => {
            dispatch(ActionCollection.actions([
              action,
              new CallbackAction(next)
            ]).catch(catchFn))
          }, catchFn);
        }
      } else {
        // unknown action, just dispatch it and ignore catching possible
        return (next, catchFn) => {
          dispatch(action);
          next();
        }
      }
     
    })
    var iterator = allActions[Symbol.iterator]();
    // var next = iterator.next();
    const next = () => {
      var cur = iterator.next();
      if(!cur.done){
        var fn = cur.value;
        fn(next, catchFn)
      }
    }
    next();
  }
  static actions(actions){
    var className = this;
    var instance = new className(actions);
    return instance;
  }
}

export default ActionCollection;