import server from "@/lib/axios";

export default function useBookApi() {
  const addToFavorites = async (bookId: string) => {
    const { data } = await server.post(`/api/favorites/${bookId}`);
    return data;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateBook = async (bookId: string, bookData: any) => {
    const { data } = await server.put(`/api/books/${bookId}`, bookData);
    return data;
  };

  const deleteBook = async (bookId: string) => {
    const { data } = await server.delete(`/api/books/${bookId}`);
    return { data };
  };

  const getBookById = async (bookId: string) => {
    const { data } = await server.get(`/api/books/${bookId}`);
    return data;
  };

  const updateStatus = async (bookId: string, isSold: boolean) => {
    await server.put(`/api/books/${bookId}/status`, { isSold });
    return { isSold };
  };

  return {
    addToFavorites,
    updateBook,
    deleteBook,
    getBookById,
    updateStatus,
  };
}
