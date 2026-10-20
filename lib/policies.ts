import { shippingRules, site } from './site';
import type { Locale } from './types';

export const policySlugs = ['returns', 'warranty', 'shipping', 'how-to-buy', 'privacy', 'faq'] as const;
export type PolicySlug = (typeof policySlugs)[number];

type Section = { h: string; p: string[] };

// Draft copy – the shop should review the exact numbers/terms (marked in lib/site.ts) before launch.
const vi: Record<PolicySlug, Section[]> = {
  returns: [
    { h: 'Đổi size trong 7 ngày', p: ['Nếu mũ chưa vừa đầu, bạn có thể đổi size trong vòng 7 ngày kể từ ngày nhận hàng.', 'Mũ cần còn nguyên tem nhãn, chưa qua sử dụng nhiều, không trầy xước hay dính bẩn và còn đầy đủ phụ kiện đi kèm.'] },
    { h: 'Đổi trả do lỗi sản xuất', p: ['Nếu mũ bị lỗi từ nhà sản xuất hoặc giao nhầm mẫu/màu, Seagull đổi mẫu mới hoặc hoàn tiền. Vui lòng gửi ảnh/video qua Zalo trong 48 giờ sau khi nhận hàng.'] },
    { h: 'Cách đổi hàng', p: [`Nhắn Zalo ${site.phoneDisplay} hoặc mang mũ đến cửa hàng tại ${site.address.full}. Phí vận chuyển đổi size do khách hàng chịu, trừ trường hợp lỗi từ cửa hàng.`] },
  ],
  warranty: [
    { h: 'Phạm vi bảo hành', p: ['Bảo hành các lỗi do nhà sản xuất như bong keo, lỗi khóa cài, lỗi gioăng/viền. Thời hạn bảo hành được ghi rõ theo từng sản phẩm hoặc thông báo khi mua.'] },
    { h: 'Không áp dụng bảo hành', p: ['Mũ đã qua va chạm mạnh, tự ý sửa chữa, tháo lắp sai cách, biến dạng do nhiệt hoặc hư hại do sử dụng không đúng hướng dẫn.', 'Sau một cú va chạm mạnh, nên thay mũ mới dù bên ngoài chưa thấy hư hại.'] },
    { h: 'Yêu cầu bảo hành', p: ['Mang mũ cùng hóa đơn/mã đơn hàng đến cửa hàng hoặc nhắn Zalo để được hướng dẫn.'] },
  ],
  shipping: [
    { h: 'Phạm vi & thời gian', p: [`Giao hàng toàn quốc qua đơn vị vận chuyển. Dự kiến ${shippingRules.etaDays.vi} tùy khu vực.`, 'Nội thành TP.HCM có thể nhận nhanh hơn – hãy nhắn Zalo để được tư vấn.'] },
    { h: 'Phí vận chuyển', p: [`Phí đồng giá ${shippingRules.flatFee.toLocaleString('vi-VN')}₫. Miễn phí vận chuyển cho đơn từ ${shippingRules.freeOver.toLocaleString('vi-VN')}₫.`, 'Phí được hiển thị trước khi bạn xác nhận đặt hàng.'] },
    { h: 'Kiểm tra khi nhận hàng', p: ['Vui lòng kiểm tra tình trạng mũ khi nhận. Nếu có vấn đề về bao bì hay sản phẩm, hãy chụp lại và liên hệ Seagull ngay.'] },
  ],
  'how-to-buy': [
    { h: 'Đặt hàng online', p: ['1. Chọn mũ, màu và size, bấm “Thêm vào giỏ”.', '2. Mở giỏ hàng, kiểm tra và bấm “Thanh toán”.', '3. Điền thông tin nhận hàng, chọn phương thức thanh toán và xác nhận.'] },
    { h: 'Phương thức thanh toán', p: ['Thanh toán khi nhận hàng (COD).', 'Chuyển khoản / quét mã QR – thông tin hiển thị ngay sau khi đặt hàng, ghi nội dung là mã đơn.', 'Ví điện tử (MoMo, ZaloPay, VNPay): sắp có.'] },
    { h: 'Cần hỗ trợ chọn size?', p: [`Nhắn Zalo ${site.phoneDisplay} hoặc xem bảng chọn size ở trang sản phẩm.`] },
  ],
  privacy: [
    { h: 'Thông tin chúng tôi thu thập', p: ['Họ tên, số điện thoại, địa chỉ nhận hàng và email (nếu có) khi bạn đặt hàng, đăng ký nhận tin hoặc gửi liên hệ.'] },
    { h: 'Mục đích sử dụng', p: ['Xử lý và giao đơn hàng, tư vấn, chăm sóc khách hàng và gửi ưu đãi (nếu bạn đăng ký). Chúng tôi không bán thông tin của bạn cho bên thứ ba.'] },
    { h: 'Quyền của bạn', p: [`Bạn có thể yêu cầu xem, sửa hoặc xóa thông tin bằng cách liên hệ ${site.email} hoặc Zalo ${site.phoneDisplay}.`] },
  ],
  faq: [
    { h: 'Mũ Seagull có phải hàng chính hãng không?', p: ['Có. Mũ bán tại cửa hàng là hàng chính hãng, kèm tem nhãn. Xem thêm trong trang Về Seagull.'] },
    { h: 'Tôi không biết chọn size nào?', p: ['Đo vòng đầu theo hướng dẫn ở bảng size, hoặc nhắn Zalo để được tư vấn. Có thể đổi size trong 7 ngày.'] },
    { h: 'Có thể thử mũ trước khi mua không?', p: [`Có, bạn có thể đến cửa hàng tại ${site.address.full} để thử trực tiếp.`] },
    { h: 'Mũ có kính che mặt không?', p: ['Tùy mẫu. Thông tin kính được ghi ở phần mô tả/thông số của từng sản phẩm. Dòng 3/4 TW-786 tương thích kính bong bóng bán riêng.'] },
    { h: 'Bao lâu tôi nhận được hàng?', p: [`${shippingRules.etaDays.vi} tùy khu vực.`] },
  ],
};

const en: Record<PolicySlug, Section[]> = {
  returns: [
    { h: '7-day size exchange', p: ['If the helmet does not fit, you can exchange the size within 7 days of receiving it.', 'The helmet must keep its tags, show no heavy use, scratches or dirt, and include all accessories.'] },
    { h: 'Manufacturing defects', p: ['If your helmet has a manufacturing defect or the wrong model/colour was sent, we will replace it or refund you. Please send photos/videos on Zalo within 48 hours of delivery.'] },
    { h: 'How to exchange', p: [`Message us on Zalo ${site.phoneDisplay} or bring the helmet to ${site.address.full}. Return shipping for size exchanges is paid by the customer unless the error is ours.`] },
  ],
  warranty: [
    { h: 'What is covered', p: ['Manufacturing defects such as peeling glue, faulty buckles or loose trim. The warranty period is stated per product or at the time of purchase.'] },
    { h: 'What is not covered', p: ['Helmets that have had a hard impact, been repaired by others, assembled incorrectly, deformed by heat or damaged through misuse.', 'After any serious impact you should replace your helmet even if it looks undamaged.'] },
    { h: 'Making a claim', p: ['Bring the helmet with your invoice/order number to our store or message us on Zalo.'] },
  ],
  shipping: [
    { h: 'Coverage & timing', p: [`We deliver nationwide through courier partners. Estimated ${shippingRules.etaDays.en}, depending on location.`, 'Orders within Ho Chi Minh City can arrive faster – message us on Zalo.'] },
    { h: 'Shipping fee', p: [`Flat fee of ${shippingRules.flatFee.toLocaleString('en-US')}₫. Free shipping on orders over ${shippingRules.freeOver.toLocaleString('en-US')}₫.`, 'The fee is shown before you confirm your order.'] },
    { h: 'On delivery', p: ['Please check the helmet when it arrives. If anything is wrong with the packaging or product, take photos and contact us right away.'] },
  ],
  'how-to-buy': [
    { h: 'Ordering online', p: ['1. Choose a helmet, colour and size, then press “Add to cart”.', '2. Open your cart, review it and press “Checkout”.', '3. Fill in your delivery details, choose a payment method and confirm.'] },
    { h: 'Payment methods', p: ['Cash on delivery (COD).', 'Bank transfer / QR – details appear right after you order; use the order number as the transfer note.', 'E-wallets (MoMo, ZaloPay, VNPay): coming soon.'] },
    { h: 'Need help with sizing?', p: [`Message Zalo ${site.phoneDisplay} or open the size guide on any product page.`] },
  ],
  privacy: [
    { h: 'What we collect', p: ['Your name, phone number, delivery address and email (if given) when you order, subscribe to news or contact us.'] },
    { h: 'How we use it', p: ['To process and deliver orders, give advice, look after customers and send offers (if you subscribed). We never sell your information to third parties.'] },
    { h: 'Your rights', p: [`You can ask to view, correct or delete your data by contacting ${site.email} or Zalo ${site.phoneDisplay}.`] },
  ],
  faq: [
    { h: 'Are Seagull helmets genuine?', p: ['Yes. Helmets sold in our store are genuine and tagged. See the About page for more.'] },
    { h: 'I do not know which size to pick', p: ['Measure your head as shown in the size guide or message us on Zalo. You can exchange size within 7 days.'] },
    { h: 'Can I try a helmet before buying?', p: [`Yes, visit us at ${site.address.full}.`] },
    { h: 'Does the helmet come with a visor?', p: ['It depends on the model; see each product’s description and specifications. The TW-786 3/4 helmets fit a separately sold bubble visor.'] },
    { h: 'How long does delivery take?', p: [`${shippingRules.etaDays.en}, depending on location.`] },
  ],
};

export const getPolicy = (slug: string, locale: Locale) =>
  (policySlugs as readonly string[]).includes(slug) ? (locale === 'en' ? en : vi)[slug as PolicySlug] : null;
