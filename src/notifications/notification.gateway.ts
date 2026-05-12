import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: 'http://localhost:3000', credentials: true },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log('--- NEW ADMIN CONNECTED ---', client.id);
    console.log('Client connected:', client.id);
    console.log('Handshake Query:', client.handshake.query);

    const role = String(
      client.handshake.auth?.role ?? client.handshake.query?.role ?? '',
    ).toLowerCase();
    const normalizedRole = role.replace(/\s+/g, '-');

    if (normalizedRole === 'super-admin' || normalizedRole === 'store-manager') {
      client.join('admin-room');
      console.log('CLIENT JOINED ADMIN-ROOM:', client.id, 'role:', normalizedRole);
      return;
    }

    console.log('Join room failed. User role was:', normalizedRole);
    client.disconnect(true);
  }

  handleDisconnect(client: Socket) {
    client.leave('admin-room');
  }

  sendNewOrderNotification(payload: {
    orderCode: string;
    totalPrice: number;
    customerName: string;
  }) {
    console.log('Order event emitted for:', payload.orderCode);
    this.server.to('admin-room').emit('NEW_ORDER_RECEIVED', payload);
  }
}
