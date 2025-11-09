const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const Bantuan = require("../models/bantuan.model");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.askHerAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question)
      return res
        .status(400)
        .json({ success: false, error: "Pertanyaan wajib diisi." });

    const bantuanList = await Bantuan.find()
      .populate("kategori_id mitra_id")
      .lean();

    const modelEmbedding = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });

    const userEmbeddingRes = await modelEmbedding.embedContent(question);
    const userEmbedding = userEmbeddingRes.embedding.values;

    const bantuanEmbeddings = await Promise.all(
      bantuanList.map(async (b) => {
        const text = `${b.judul}
          ${b.deskripsi}
          ${b.kategori_id?.nama_kategori || ""}
          ${b.mitra_id?.nama || ""}
          ${b.bentuk_bantuan || ""}
          ${b.jangkauan || ""}`;
        const result = await modelEmbedding.embedContent(text);
        return {
          bantuan: b,
          embedding: result.embedding.values,
        };
      })
    );

    const cosineSimilarity = (a, b) => {
      const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return dot / (normA * normB);
    };

    const scored = bantuanEmbeddings.map(({ bantuan, embedding }) => ({
      bantuan,
      score: cosineSimilarity(userEmbedding, embedding),
    }));

    const relevant = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((r) => r.bantuan);

    const bantuanContext = relevant
      .map(
        (b) => `Judul: ${b.judul}
Kategori: ${b.kategori_id?.nama_kategori || "Tidak disebutkan"}
Deskripsi: ${b.deskripsi || "Tidak ada deskripsi"}
Mitra: ${b.mitra_id?.nama || "Tidak disebutkan"}
Lokasi: ${b.jangkauan || "Tidak disebutkan"}
Bentuk Bantuan: ${b.bentuk_bantuan || "Tidak disebutkan"}
Periode: ${new Date(b.periode_mulai).toLocaleDateString("id-ID")} - ${new Date(
          b.periode_berakhir
        ).toLocaleDateString("id-ID")}`
      )
      .join("\n---\n");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Kamu adalah Her AI, asisten ramah dari website ToGetHer — platform yang membantu perempuan kepala rumah tangga miskin mendapatkan bantuan sosial.
Jawablah pertanyaan pengguna dengan konteks bantuan di bawah ini.
Jika bantuan relevan tersedia, sebutkan nama programnya.
Gunakan bahasa Indonesia ringan, maksimal 3 kalimat.

Berikut bantuan relevan:
${bantuanContext}

Pertanyaan: "${question}"`;

    const result = await model.generateContent(prompt);
    const responseText =
      result?.response?.text?.() ||
      "Belum ada bantuan yang relevan dengan kebutuhan Anda.";

    res.json({
      success: true,
      message: "Jawaban berhasil dihasilkan.",
      answer: responseText,
      related: relevant,
    });
  } catch (error) {
    console.error("Error HerAI:", error.message || error);
    res.status(500).json({
      success: false,
      error: "Gagal memproses pertanyaan Her AI.",
      details: error.message,
    });
  }
};
