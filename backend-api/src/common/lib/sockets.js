const sio = require('socket.io');
const jwt = require('jsonwebtoken');
const { keys } = require('src/common/data');
const logger = require('./logger');

let connection = null;

class SocketIO {
  constructor() {
    this.sockets = {};
    this.authenticatedUsers = {};
    this.authenticatedClients = {};
    this.markups = null;
    this.loadMarkups();
  }

  async loadMarkups() {
    this.markups = [];
  }

  connect(server, sessionMiddleware) {
    logger.info(`Socket initializing ${server.toString()}`);
    this.io = sio(server, {
      cors: {
        origin: '*',
      },
    });
    this.io.use((socket, next) => {
      sessionMiddleware(socket.request, socket.request.res, next);
    });
    this.io.use((socket, next) => {
      try {
        if (socket.handshake.auth && socket.handshake.auth.crmToken) {
          const decoded = jwt.verify(socket.handshake.auth.crmToken, keys.jwtKey);
          this.saveCRMSocketConnection(socket, decoded);
        } else if (socket.handshake.auth && socket.handshake.auth.cpToken) {
          const decoded = jwt.verify(socket.handshake.auth.cpToken, keys.jwtKey);
          this.saveCPSocketConnection(socket, decoded);
        } else {
          this.saveSocketConnection(socket);
        }
      } catch (error) {
        this.saveSocketConnection(socket);
      }
      next();
    });
  }

  saveSocketConnection(socket, decoded = {}) {
    logger.info('Client connected');
    this.sockets[socket.id] = {
      ...decoded,
      socket,
    };
    logger.info(`Client connected, ${socket.id}`);
    socket.on('disconnect', () => {
      logger.info(`Client disconnected, ${socket.id}`);
      this.deleteSocketConnection(socket.id, this.sockets);
    });
  }

  saveCRMSocketConnection(socket, decoded) {
    this.authenticatedUsers[socket.id] = {
      ...decoded,
      socket,
    };
    logger.info(`CRM User Connected ${decoded._id}, socketId: ${socket.id}`);
    socket.on('disconnect', () => {
      logger.info(`CRM User Disconnected ${decoded._id}, socketId: ${socket.id}`);
      this.deleteSocketConnection(socket.id, this.authenticatedUsers);
    });
  }

  saveCPSocketConnection(socket, decoded) {
    this.authenticatedClients[socket.id] = {
      ...decoded,
      socket,
    };
    logger.info(`CP User Connected ${decoded._id}, socketId: ${socket.id}`);
    socket.on('disconnect', () => {
      logger.info(`CP User Disconnected ${decoded._id}, socketId: ${socket.id}`);
      this.deleteSocketConnection(socket.id, this.authenticatedClients);
    });
  }

  deleteSocketConnection(socketId, deleteFrom) {
    delete deleteFrom[socketId];
  }

  get() {
    return this.io;
  }

  findCRMSocket(key = '_id', value) {
    const foundSockets = [];
    Object.keys(this.authenticatedUsers).forEach((socketId) => {
      if (this.authenticatedUsers[socketId][key] === value) {
        foundSockets.push(this.authenticatedUsers[socketId]);
      }
    });
    return foundSockets;
  }

  findCPSocket(key = '_id', value) {
    const foundSockets = [];
    Object.keys(this.authenticatedClients).forEach((socketId) => {
      if (this.authenticatedClients[socketId][key] === value) {
        foundSockets.push(this.authenticatedClients[socketId]);
      }
    });
    return foundSockets;
  }

  sendEvent(event, data, socketId, sendTo = null) {
    this.io.to(socketId).emit(event, JSON.stringify(data));
  }

  broadcastEvent(event, data, sendTo = null) {
    this.io.sockets.emit(event, JSON.stringify(data));
  }

  registerEvent(event, handler, socketId) {
    this.sockets[socketId].on(event, handler);
  }

  getAllConnections() {
    return {
      ...this.sockets,
      ...this.authenticatedClients,
      ...this.authenticatedUsers,
    };
  }

  static init(server, sessionMiddleware) {
    if (!connection) {
      connection = new SocketIO();
      connection.connect(server, sessionMiddleware);
    }
  }

  static getConnection() {
    if (!connection) {
      throw new Error('no active connection');
    }
    return connection;
  }
}

module.exports = {
  connect: SocketIO.init,
  connection: SocketIO.getConnection,
};

// setTimeout(() => {
//     const lib = require('src/common/lib');
//     logger = lib.logger;
// }, 0);
