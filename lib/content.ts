export type IndicatorKey = "ungu" | "biru" | "kuning";

export type Indicator = {
  no: string;
  name: string;
  short: string;
  color: string;
  text: string;
  action: string;
  uses: string[];
};

export const indicators: Record<IndicatorKey, Indicator> = {
  ungu: {
    no: "01",
    name: "Indikator ungu",
    short: "kondisi awal indikator",
    color: "#8a52cf",
    text: "Kondisi awal indikator. Gunakan informasi ini sebagai konteks tambahan, lalu tetap periksa kondisi fisik pakcoy.",
    action: "Prioritaskan pemanfaatan sebagai makanan.",
    uses: ["Salad pakcoy", "Pakcoy kuah bening", "Capcay", "Pakcoy saus lemon"]
  },
  biru: {
    no: "02",
    name: "Biru",
    short: "indikator mulai berubah",
    color: "#7699d8",
    text: "Indikator mulai berubah dari kondisi awal. Pemanfaatan sebagai makanan dapat dipertimbangkan setelah pemeriksaan fisik.",
    action: "Pertimbangkan olahan makanan.",
    uses: ["Nasi goreng pakcoy", "Sup pakcoy", "Keripik pakcoy"]
  },
  kuning: {
    no: "03",
    name: "Kuning",
    short: "perubahan lebih lanjut",
    color: "#d5b344",
    text: "Perubahan indikator lebih lanjut. Prioritas pemanfaatan dialihkan ke opsi non-makanan setelah mempertimbangkan kondisi pakcoy.",
    action: "Alihkan ke pemanfaatan non-makanan.",
    uses: ["Kompos", "Makanan maggot BSF"]
  }
};

export const steps = [
  { no: "01", title: "Simpan", body: "Jaga kemasan tetap bersih, kering, dan hindari sinar matahari langsung." },
  { no: "02", title: "Pantau", body: "Perhatikan perubahan indikator dari waktu ke waktu." },
  { no: "03", title: "Periksa", body: "Bandingkan indikator dengan daun, batang, tekstur, aroma, dan kondisi fisik pakcoy." },
  { no: "04", title: "Tentukan", body: "Pilih pemanfaatan yang paling sesuai dengan kondisi yang ditemukan." },
  { no: "05", title: "Manfaatkan", body: "Gunakan pakcoy sesuai kondisi untuk membantu mengurangi pemborosan." }
];

export const care = [
  "Periksa daun dan batang secara langsung untuk melihat perubahan yang tidak normal.",
  "Perhatikan tekstur, termasuk apakah pakcoy menjadi terlalu lunak atau berlendir.",
  "Perhatikan aroma yang tidak normal.",
  "Pertimbangkan kondisi dan lama penyimpanan saat menentukan tindakan."
];
