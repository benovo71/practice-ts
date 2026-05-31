/**
 * Экранирует HTML-спецсимволы в строке для безопасного вставления в DOM
 * @param str - строка для экранирования
 * @returns экранированная строка
 */
export function escapeHtml(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}