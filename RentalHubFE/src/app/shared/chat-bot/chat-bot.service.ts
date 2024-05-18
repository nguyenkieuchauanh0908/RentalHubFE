import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, catchError, tap } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { AccountService } from 'src/app/accounts/accounts.service';
import { environment } from 'src/environments/environment';
import { handleError } from '../handle-errors';
import { resDataDTO } from '../resDataDTO';

export interface UserChatsType {
  _id: String;
  members: String[];
  lsmessage: String;
  lssender: String;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageType {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipientType {
  _id: string;
  _avatar: string;
  _name: string;
  _email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatContextType {
  onlineUsers: { userId: string; socketId: string }[] | [];
}

export interface UserOnlineType {
  userId: string;
  socketId: string;
}
@Injectable({
  providedIn: 'root',
})
export class ChatBotService {
  $destroy: Subject<boolean> = new Subject<boolean>();
  socket = io('http://localhost:3000');

  private currentSocket = new BehaviorSubject<Socket | null>(null); //Socket
  getCurrentSocket = this.currentSocket.asObservable();
  setCurrentSocket(socket: Socket | null) {
    this.currentSocket.next(socket);
  }

  private chatBotMenuOpened = new BehaviorSubject<boolean>(false); //Quy định trạng thái đóng mở của chatBotMenu
  getChatBotMenuOpened = this.chatBotMenuOpened.asObservable();
  setChatBotMenuOpened(opened: boolean) {
    this.chatBotMenuOpened.next(opened);
  }

  private seeContactList = new BehaviorSubject<Boolean>(true); //Có đang xem contact list hay không
  getSeeContactList = this.seeContactList.asObservable();
  setSeeContactList(see: Boolean) {
    this.seeContactList.next(see);
  }

  private currentUserChats = new BehaviorSubject<UserChatsType[] | null>(null); //Các chats hiện có của users
  getCurrentUserChats = this.currentUserChats.asObservable();
  setCurrentUserChats(updatedChats: UserChatsType[] | null) {
    return this.currentUserChats.next(updatedChats);
  }

  private onlineUsers = new BehaviorSubject<
    { userId: string; socketId: string }[] | null
  >([]); //Các online users hiện tại
  getCurrentOnlineUsers = this.onlineUsers.asObservable();
  setOnlineUsers(
    updatedOnlineUsers: { userId: string; socketId: string }[] | null
  ) {
    this.onlineUsers.next(updatedOnlineUsers);
  }

  private currentChat = new BehaviorSubject<UserChatsType | null>(null); //Chat hiện tại để hiển thị
  getCurrentChat = this.currentChat.asObservable();
  setCurrentChat(updatedChat: UserChatsType | null) {
    return this.currentChat.next(updatedChat);
  }

  private currentRecipient = new BehaviorSubject<RecipientType | null>(null); //Thông tin người nhận hiện tại
  getCurrentRecipient = this.currentRecipient.asObservable();
  setCurrentRecipient(updatedRecipient: RecipientType | null) {
    this.currentRecipient.next(updatedRecipient);
  }

  private messages = new BehaviorSubject<MessageType[] | null>(null); //Các messages của currentChat
  getMessages = this.messages.asObservable();
  setMessages(updatedMessages: MessageType[] | null) {
    return this.messages.next(updatedMessages);
  }

  private newMessage = new BehaviorSubject<MessageType | null>(null); //Dùng để xác định xem có tin nhắn mới được gửi đi hay không
  getNewMessage = this.newMessage.asObservable();
  setNewMessage(newMessage: MessageType | null) {
    return this.newMessage.next(newMessage);
  }

  private isAuthenticated: Boolean = false;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {}

  //Connect to the socket
  initiateSocket() {
    this.setCurrentSocket(this.socket);

    return () => {
      this.socket.disconnect();
    };
  }

  //Disconnects the socket
  disconnectToSocket(): void {
    this.getCurrentSocket.subscribe((socket) => {
      if (socket) {
        socket.disconnect();
        console.log('socket disconnected!');
      }
    });
  }

  //Socket event's name: 'addNewUser'
  emittingAddingMeToOnlineUsers(uId: String) {
    this.getCurrentSocket.subscribe((socket) => {
      if (socket) {
        socket.emit('addNewUser', uId);
      }
    });
  }

  //Socket event's name: 'getOnlineUsers'
  onGettingOnlineUsers = () => {
    this.getCurrentSocket.subscribe((socket) => {
      if (socket) {
        socket.on('getOnlineUsers', (onlineUsers: any) => {
          console.log(
            '🚀 ~ ChatBotService1 ~ socket.on ~ onlineUsers:',
            onlineUsers
          );
          this.setOnlineUsers(onlineUsers);
          return () => {
            socket.off('getOnlineUsers');
          };
        });
      }
    });
  };

  //Socket event's name: 'getMessage'
  onReceivingChatMessageToUpdate = () => {
    console.log('Receiving new message...');
    let updatedMsgs: MessageType[] | null = null;
    this.getCurrentSocket.subscribe((socket) => {
      if (socket) {
        socket.on('getMessage', (msg: MessageType) => {
          console.log('🚀 ~ ChatBotService ~ socket.on ~ msg:', msg);
          this.getCurrentChat.subscribe((currentChat) => {
            if (currentChat?._id !== msg.chatId) return;
            this.getMessages.subscribe((messages) => {
              updatedMsgs = messages;
            });
            if (updatedMsgs) {
              this.setMessages([...updatedMsgs, msg]);
            } else {
              this.setMessages([msg]);
            }
          });
        });
      }
    });
  };

  //Socket event's name: 'sendMessage'
  emitSendingChatMessage(uId: string) {
    console.log('emitSendingChatMessage');
    this.getCurrentChat.subscribe((currentChat) => {
      let recipientId = currentChat?.members?.find((id) => id !== uId);
      this.getCurrentSocket.subscribe((socket) => {
        if (socket) {
          this.getNewMessage.subscribe((newMessage) => {
            if (newMessage) {
              console.log(
                '🚀 ~ ChatBotService ~ this.getNewMessage.subscribe ~ newMessage:',
                newMessage
              );
              socket.emit('sendMessage', { ...newMessage, recipientId });
            }
          });

          this.setNewMessage(null);
        }
      });
    });
  }

  //API lấy toàn bộ chats của một user
  fetchMyChats(uId: string) {
    let queryParams = new HttpParams().append('userId', uId);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'chat/find-user-chats', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Get chats successfully!', res.data);
            this.setCurrentUserChats(res.data);
          }
        })
      );
  }

  //API lấy thông tin chat hiện tại
  fetchCurrentChat(uId1: String, uId2: String) {
    let queryParams = new HttpParams()
      .append('firstId', uId1.toString())
      .append('secondId', uId2.toString());
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'chat/find-chat', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Get current chat successfully!', res.data);
            this.setCurrentChat(res.data);
          }
        })
      );
  }

  //API lấy toàn bộ messages của một đoạn chat
  fetchMessagesOfAChat(chatId: string) {
    let queryParams = new HttpParams().append('chatId', chatId);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'message/get-messages', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            this.setMessages(res.data);
          }
        })
      );
  }

  //API tạo message mới của một đoạn chat
  creatingNewMessage(chatId: string, senderId: string, message: string) {
    let updatedMsgs: MessageType[] | null = null;
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'message/create-message', {
        chatId: chatId,
        senderId: senderId,
        text: message,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            this.setNewMessage(res.data);
            //Cập nhật lại msgs của chat
            this.getMessages.subscribe((msg) => {
              updatedMsgs = msg;
            });
            if (updatedMsgs) {
              this.setMessages([...updatedMsgs, res.data]);
            } else {
              this.setMessages([res.data]);
            }
          }
        })
      );
  }

  //API lấy thông tin người nhận
  fetchRecipientInfo(recipientId: string) {
    let paramQuery = new HttpParams().append('userId', recipientId);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'users/find', {
        params: paramQuery,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            this.setCurrentRecipient(res.data);
          }
        })
      );
  }

  //API tạo đoạn chat mới
  createNewChat(uId1: string, uId2: string) {
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'chat/create-chat', {
        firstId: uId1,
        secondId: uId2,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            let updatedChats: UserChatsType[] | null = null;
            this.getCurrentUserChats.subscribe((chats) => {
              if (chats) {
                updatedChats = chats;
              }
            });
            this.setCurrentUserChats(updatedChats);
          }
        })
      );
  }
}
