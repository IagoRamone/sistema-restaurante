import { FloorLayout } from "@/types/restaurant";

export const defaultLayout: FloorLayout = {
  name: "Braseiro Continental",
  width: 1100,
  height: 800,

  tables: [
    // === Mesas externas (esquerda, fora do salão) ===
    { id: "t02", label: "02", x: 20, y: 270, width: 60, height: 50, shape: "rect", seats: 4 },
    { id: "t01", label: "01", x: 20, y: 340, width: 60, height: 50, shape: "rect", seats: 4 },

    // === Canto superior esquerdo (dentro do salão) ===
    { id: "t03", label: "03", x: 130, y: 120, width: 40, height: 45, shape: "rect", seats: 2 },
    { id: "t04", label: "04", x: 185, y: 120, width: 40, height: 45, shape: "rect", seats: 2 },

    // === Mesa redonda superior ===
    { id: "t05", label: "05", x: 285, y: 115, width: 70, height: 70, shape: "circle", seats: 4 },

    // === Mesas 06-07 (abaixo da cozinha, esquerda) ===
    { id: "t06", label: "06", x: 185, y: 230, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t07", label: "07", x: 280, y: 230, width: 65, height: 50, shape: "rect", seats: 4 },

    // === Coluna esquerda (08-11) ===
    { id: "t08", label: "08", x: 195, y: 330, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t09", label: "09", x: 195, y: 400, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t10", label: "10", x: 195, y: 470, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t11", label: "11", x: 195, y: 540, width: 65, height: 50, shape: "rect", seats: 4 },

    // === Mesas inferiores esquerda (12-13) ===
    { id: "t12", label: "12", x: 175, y: 660, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t13", label: "13", x: 280, y: 660, width: 65, height: 50, shape: "rect", seats: 4 },

    // === Coluna centro-esquerda (14-17) ===
    { id: "t14", label: "14", x: 310, y: 540, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t15", label: "15", x: 310, y: 470, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t16", label: "16", x: 310, y: 400, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t17", label: "17", x: 310, y: 330, width: 65, height: 50, shape: "rect", seats: 4 },

    // === Coluna central (18-21) ===
    { id: "t18", label: "18", x: 440, y: 330, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t19", label: "19", x: 440, y: 400, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t20", label: "20", x: 440, y: 470, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t21", label: "21", x: 440, y: 540, width: 65, height: 50, shape: "rect", seats: 4 },

    // === Coluna centro-direita (23-26) ===
    { id: "t22", label: "22", x: 470, y: 660, width: 75, height: 50, shape: "rect", seats: 4 },
    { id: "t23", label: "23", x: 565, y: 540, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t24", label: "24", x: 565, y: 470, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t25", label: "25", x: 565, y: 400, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t26", label: "26", x: 565, y: 330, width: 65, height: 50, shape: "rect", seats: 4 },

    // === Coluna direita (27-30) ===
    { id: "t27", label: "27", x: 680, y: 330, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t28", label: "28", x: 680, y: 400, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t29", label: "29", x: 680, y: 470, width: 65, height: 50, shape: "rect", seats: 4 },
    { id: "t30", label: "30", x: 680, y: 540, width: 65, height: 50, shape: "rect", seats: 4 },

    // === Mesas no balcão inferior (31-32) ===
    { id: "t31", label: "31", x: 600, y: 660, width: 75, height: 50, shape: "rect", seats: 4 },
    { id: "t32", label: "32", x: 730, y: 660, width: 75, height: 50, shape: "rect", seats: 4 },

    // === Mesa redonda direita (33) ===
    { id: "t33", label: "33", x: 820, y: 490, width: 75, height: 75, shape: "circle", seats: 6 },
  ],

  decorations: [
    // Bar (área grande no topo)
    { id: "d1", type: "counter", label: "Bar", x: 400, y: 100, width: 550, height: 160, rotation: 0 },

    // Balcão inferior com banquetas
    { id: "d2", type: "counter", label: "Balcão", x: 430, y: 640, width: 420, height: 90, rotation: 0 },

    // Churrasqueira (acima da cozinha, com cadeiras voltadas para o salão)
    { id: "d7", type: "churrasqueira", label: "Churrasqueira", x: 20, y: 410, width: 90, height: 100, seats: 4 },

    // Cozinha (esquerda, embaixo)
    { id: "d3", type: "kitchen", label: "Cozinha", x: 20, y: 525, width: 90, height: 70 },

    // Entrada (direita, flush com a borda do salão)
    { id: "d4", type: "entrance", label: "Entrada", x: 1030, y: 260, width: 70, height: 300 },
  ],
};
