// import {
//   takeLatest, call 
// } from "redux-saga/effects";
// import { eventChannel, END } from "redux-saga";

// import { socket } from "../../socket";
// import { INITIALIZE_SOCKET_MESSAGES } from "./actionTypes";

// const pricingMessagesReceived = () => {
//   return eventChannel((emitter) => {
//     socket.on("pricing", (msg) => {
//       emitter(JSON.parse(msg));
//     });
//     return () => {
//       emitter(END);
//     };
//   });
// };

// const orderBookMessagesReceived = (orderBookChannelNames = []) => {
//   return eventChannel((emitter) => {
//     orderBookChannelNames.forEach(channelName => {
//       socket.on(channelName, (msg) => {
//         emitter(JSON.parse(msg));
//       });
//     });
//     return () => {
//       emitter(END);
//     };
//   });
// };


// function * initializeSocketMessages({ payload }) {
//   try {
//     const {
//       pricingChannelName,
//       orderBookChannelNames,
//     } = payload;
//     const pricingChannel = yield call(pricingMessagesReceived, pricingChannelName);
//     const orderBookChannel = yield call(orderBookMessagesReceived, orderBookChannelNames);
//     // while (true) {
//     //   const priceVal = yield take(pricingChannel);
//     //   yield put(updateMarkets(priceVal));

//     //   const orderBookVal = yield take(orderBookChannel);
//     //   yield put(updateOrderBooks(orderBookVal));
//     //   yield delay(1000)
//     // }
//   }
//   catch (err){
//     // socketChannel is still open in catch block
//     // if we want end the socketChannel, we need close it explicitly
//     // socketChannel.close()
//   } 
// }

function* socketsSaga() {
  // yield takeLatest(INITIALIZE_SOCKET_MESSAGES, initializeSocketMessages);
}

export default socketsSaga;
