import chatSaga from './chatSaga';
import { all } from "redux-saga/effects";
export default function* rootSaga() {
  yield all([
    chatSaga(),
  ]);
}
