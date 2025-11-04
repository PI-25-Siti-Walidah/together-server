const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const Bantuan = require("../models/bantuan.model");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.askHerAI = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question)
      return res.status(400).json({ error: "Pertanyaan wajib diisi" });

    const bantuanList = await Bantuan.find()
      .populate("kategori_id mitra_id")
      .lean();

    const bantuanContext = bantuanList
      .map(
        (b) => `
Judul: ${b.judul}
Kategori: ${b.kategori_id?.nama_kategori || "Tidak disebutkan"}
Deskripsi: ${b.deskripsi || "Tidak ada deskripsi"}
Mitra: ${b.mitra_id?.nama || "Tidak disebutkan"}
Lokasi/Jangkauan: ${b.jangkauan || "Tidak disebutkan"}
Bentuk Bantuan: ${b.bentuk_bantuan || "Tidak disebutkan"}
Periode: ${new Date(b.periode_mulai).toLocaleDateString()} - ${new Date(
          b.periode_berakhir
        ).toLocaleDateString()}
`
      )
      .join("\n---\n");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Kamu adalah asisten AI bernama HerAI yang membantu masyarakat menemukan bantuan sosial yang paling relevan.

Berikut daftar bantuan yang tersedia:
${bantuanContext}

Pertanyaan pengguna:
"${question}"

Tugas kamu:
1. Cari bantuan yang paling relevan dengan pertanyaan pengguna berdasarkan makna (bukan sekadar kata yang sama).
2. Gunakan deskripsi bantuan untuk memahami konteks — misalnya "biaya sekolah" berarti "bantuan pendidikan".
3. Jawab dengan gaya ramah dan jelas, maksimal 3 kalimat.
4. Jika ada bantuan yang cocok, sebutkan nama program dan deskripsi singkatnya.
5. Jika tidak ada, jawab dengan: "Belum ada bantuan yang relevan dengan kebutuhan tersebut."
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ success: true, answer: response });
  } catch (error) {
    console.error(
      "Error Gemini detail:",
      error.response?.data || error.message || error
    );
    res.status(500).json({
      success: false,
      error: "Gagal memproses pertanyaan AI",
    });
  }
};
