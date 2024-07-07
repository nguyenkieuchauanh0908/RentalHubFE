// filter.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';
import { UserChatsType } from '../chat-bot/chat-bot.service';

@Pipe({ name: 'chatsFilter' })
export class ChatFilterPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param chats list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */
  transform(chats: UserChatsType[], searchText: string): any[] {
    if (!chats) {
      return [];
    }
    if (!searchText) {
      return chats;
    }
    searchText = searchText.toLocaleLowerCase();

    return chats.filter((chat) => {
      return chat.reciverName.toLocaleLowerCase().includes(searchText);
    });
  }
}
