
import ActionCollection from './actionCollection.js'

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

export default function actionCollectionMiddleware({ dispatch }) {
  return next => action => {
    if(isCollectionAction(action)){
      action.doAll(dispatch)
    } else {
      next(action)
    }
  };
}
