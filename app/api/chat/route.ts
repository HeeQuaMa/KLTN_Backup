import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, UIMessage } from "ai";

// Cho phép Vercel Serverless Function chạy tối đa 30 giây (nếu có deploy)
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // AI SDK v6: frontend gửi lên UIMessage[] (có 'parts')
    // Cần convert sang ModelMessage[] trước khi truyền vào streamText
    const { messages }: { messages: UIMessage[] } = await req.json();

    const modelMessages = await convertToModelMessages(messages);

    // Gọi API Gemini sử dụng Vercel AI SDK
    const result = await streamText({
      model: google("gemini-2.5-flash"),
      system: `Bạn là trợ lý ảo AI chuyên nghiệp của NetTech - Một hệ thống bán lẻ và xây dựng cấu hình PC hàng đầu.
Bạn luôn chào hỏi thân thiện, xưng "tôi" và gọi khách hàng là "bạn" hoặc "quý khách".
Nhiệm vụ duy nhất của bạn là:
- Tư vấn build cấu hình PC (máy tính bàn).
- Tư vấn lựa chọn linh kiện máy tính (CPU, VGA, RAM, Mainboard, Nguồn, Tản nhiệt, Màn hình, v.v...).
- Giải đáp các thắc mắc liên quan đến phần cứng máy tính và nhu cầu sử dụng (chơi game, đồ họa, văn phòng).

Quy tắc bắt buộc:
1. LUÔN HỎI RÕ nhu cầu sử dụng (chơi game gì, phần mềm đồ họa nào) và NGÂN SÁCH dự kiến trước khi đưa ra cấu hình chi tiết.
2. KHÔNG BAO GIỜ trả lời các chủ đề ngoài lề (ví dụ: công thức nấu ăn, thời tiết, lịch sử, toán học, sức khỏe, lập trình phần mềm không liên quan...).
3. Nếu khách hàng hỏi ngoài lề, hãy từ chối khéo léo và lái câu chuyện về máy tính/linh kiện. Ví dụ: "Xin lỗi bạn, tôi chỉ là trợ lý chuyên tư vấn cấu hình PC và linh kiện tại NetTech. Bạn có cần tôi giúp gì về máy tính không ạ?".
4. Trình bày các cấu hình rõ ràng, dễ đọc, liệt kê từng linh kiện với tên chính xác và lý do chọn linh kiện đó.`,
      messages: modelMessages,
    });

    // AI SDK v6: dùng toUIMessageStreamResponse() để tương thích với useChat @ai-sdk/react v3
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);
    return new Response(JSON.stringify({ error: "Có lỗi xảy ra khi xử lý yêu cầu" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
