export interface FormData {
  email: string;
  password: string;
}

export interface UserData {
  email: string;
  password: string;
  username: string;
}

export interface BookData {
  id: number;
  title: string;
  authors: string[];
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  thumbnail?: string;
  isbn: string;
}

export interface BookShelfEntry {
  id: number;
  book: BookData | null;
  swap: boolean;
  user: UserData;
  userId: number;
}

export interface RequestItemProps {
  request: {
    id: number;
    owner: {
      email: string;
      username: string;
    };
    requestedBook: {
      title: string;
    };
    book: {
      title: string;
    };
    alternativeBookTitle?: string;
    status: string;
    requester: {
      user_id: number;
    };
  };
  handleAccept: (id: number) => void;
  handleDecline: (id: number, userId: number) => void;
  handleAcceptAlternative: (id: number, bookId: number) => void;
  handleAlternativeResponse: (id: number, response: string) => void;
  requesterSwapShelf: {
    id: number;
    book: {
      title: string;
    };
  }[];
}
