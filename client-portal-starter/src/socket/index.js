import socketio from "socket.io-client";
import { GetToken } from "../apis/api_helper";
import Config from "../config";
import { socketEvents } from "./events";

export const socket = socketio.connect(Config.SOCKET_URL, {
  auth: {
    cpToken: GetToken(),
  }
});

export const initSockets = ({ state, setState }) => {
  socketEvents({
    state,
    setState 
  });
};
