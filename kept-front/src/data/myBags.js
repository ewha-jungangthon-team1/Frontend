const SMART_MODULE_NOTE = "하단 스마트 소재 모듈 적용";

export const MY_BAG_CATEGORIES = [
  {
    id: "top-handle",
    label: "탑 핸들백",
    bags: [
      {
        id: "top-handle-01",
        apiModelName: "Visetos Original Boston Bag",
        image: "/images/my-bag/top-handle-01.png",
        alt: "Visetos Original Boston Bag",
        name: "Visetos Original\nBoston Bag",
        description:
          "부드러운 스웨이드와 모노그램 패턴으로\n완성한 구조적인 실루엣의 슬링 백",
        materials: [
          "바디: 스웨이드 가죽",
          "트림: 천연 가죽",
          "안감: 마이크로파이버",
          "하드웨어: 골드톤 브라스",
        ],
        note: SMART_MODULE_NOTE,
        isMain: true,
      },
      {
        id: "top-handle-02",
        image: "/images/my-bag/top-handle-02.png",
        alt: "Toni Visetos Top-Zip Shopper",
        name: "Toni Visetos\nTop-Zip Shopper",
        description:
          "세로형 실루엣과 긴 탑 핸들로\n일상적인 수납에 적합한 경량 쇼퍼백",
        materials: [
          "바디: 비세토스 코팅 캔버스",
          "트림: 천연 가죽",
          "안감: 패브릭 라이닝",
          "하드웨어: 골드톤 메탈",
        ],
        note: SMART_MODULE_NOTE,
        isMain: false,
      },
      {
        id: "top-handle-03",
        image: "/images/my-bag/top-handle-03.png",
        alt: "Tracy Visetos Leather Mix Satchel",
        name: "Tracy Visetos\nLeather Mix Satchel",
        description:
          "부드러운 플랩과 구조적인 바디가\n조화를 이루는 클래식 사첼백",
        materials: [
          "바디: 비세토스 코팅 캔버스",
          "플랩 및 트림: 천연 가죽",
          "안감: 마이크로파이버",
          "하드웨어: 골드톤 브라스",
        ],
        note: SMART_MODULE_NOTE,
        isMain: false,
      },
      {
        id: "top-handle-04",
        image: "/images/my-bag/top-handle-04.png",
        alt: "Aren Recycled Nylon Monogram Shopper",
        name: "Aren Recycled Nylon\nMonogram Shopper",
        description:
          "가벼운 재생 나일론과\n모노그램 가죽 디테일을 조합한 현대적인 쇼퍼백",
        materials: [
          "바디: 재생 나일론",
          "트림: 모노그램 프린트 가죽",
          "안감: 재생 폴리에스터",
          "하드웨어: 실버톤 메탈",
          "스트랩: 탈부착 숄더 스트랩",
        ],
        note: SMART_MODULE_NOTE,
        isMain: false,
      },
    ],
  },
  {
    id: "shoulder",
    label: "숄더백&크로스백",
    bags: [
      {
        id: "shoulder-01",
        image: "/images/my-bag/shoulder-01.png",
        alt: "Aren Visetos E/W Chain Bag",
        name: "Aren Visetos\nE/W Chain Bag",
        description: "낮고 가로로 긴 실루엣과\n체인 디테일이 돋보이는 체인백",
        materials: [
          "바디: 비세토스 코팅 캔버스",
          "트림: 천연 가죽",
          "안감: 마이크로파이버",
          "하드웨어: 골드톤 체인",
        ],
        note: SMART_MODULE_NOTE,
        isMain: false,
      },
      {
        id: "shoulder-02",
        apiModelName: "Vela Visetos Sling Bag",
        image: "/images/my-bag/shoulder-02.png",
        alt: "Vela Visetos Sling Bag",
        name: "Vela Visetos\nSling Bag",
        description:
          "톤온톤 모노그램과 부드러운\n곡선형 실루엣이 돋보이는 미니멀한 슬링백",
        materials: [
          "바디: 비세토스 코팅 캔버스",
          "트림: 천연 가죽",
          "안감: 마이크로파이버",
          "하드웨어: 실버톤 메탈",
        ],
        note: SMART_MODULE_NOTE,
        isMain: false,
      },
      {
        id: "shoulder-03",
        image: "/images/my-bag/shoulder-03.png",
        alt: "Ella Visetos Boston Bag",
        name: "Ella Visetos\nBoston Bag",
        description:
          "라운드 핸들과 볼륨감 있는\n사각 실루엣이 특징인 데일리 보스턴 백",
        materials: [
          "바디: 비세토스 코팅 캔버스",
          "트림: 천연 가죽",
          "안감: 패브릭",
          "하드웨어: 골드톤 브라스",
        ],
        note: SMART_MODULE_NOTE,
        isMain: false,
      },
    ],
  },
  {
    id: "mini",
    label: "미니백",
    bags: [
      {
        id: "mini-01",
        image: "/images/my-bag/mini-01.png",
        alt: "Pina Visetos Tambourine Bag",
        name: "Pina Visetos\nTambourine Bag",
        description:
          "부드러운 라운드 실루엣과\n컴팩트한 크기가 돋보이는 미니 크로스바디백",
        materials: [
          "바디: 비세토스 코팅 캔버스",
          "트림: 천연 가죽",
          "안감: 마이크로파이버",
          "하드웨어: 골드톤 메탈",
        ],
        note: SMART_MODULE_NOTE,
        isMain: false,
      },
      {
        id: "mini-02",
        image: "/images/my-bag/mini-02.png",
        alt: "Dessau Visetos Drawstring Bag",
        name: "Dessau Visetos\nDrawstring Bag",
        description:
          "유연한 버킷 실루엣과\n드로우스트링 구조가 특징인 캐주얼 숄더백",
        materials: [
          "바디: 비세토스 코팅 캔버스",
          "트림: 천연 가죽",
          "안감: 패브릭",
          "하드웨어: 골드톤 체인",
        ],
        note: SMART_MODULE_NOTE,
        isMain: false,
      },
      {
        id: "mini-03",
        image: "/images/my-bag/mini-03.png",
        alt: "Tracy Visetos Chain Wallet",
        name: "Tracy Visetos\nChain Wallet",
        description:
          "컴팩트한 플랩 구조와\n골드 체인을 조합한 미니멀 체인 월렛",
        materials: [
          "바디: 비세토스 코팅 캔버스",
          "트림: 천연 가죽",
          "안감: 마이크로파이버",
          "하드웨어: 골드톤 브라스",
        ],
        note: SMART_MODULE_NOTE,
        isMain: false,
      },
    ],
  },
  {
    id: "other",
    label: "기타",
    bags: [
      {
        id: "other-01",
        image: "/images/my-bag/other-01.png",
        alt: "Diamond Visetos Leather Mix Clutch",
        name: "Diamond Visetos\nLeather Mix Clutch",
        description: "비세토스 패턴과\n곡선형 가죽 패널을 조합한 슬림 클러치백",
        materials: [
          "바디: 비세토스 코팅 캔버스",
          "하단 패널: 천연 가죽",
          "안감: 마이크로파이버",
          "하드웨어: 골드톤 메탈",
          "스트랩: 체인 및 레더 스트랩",
        ],
        note: SMART_MODULE_NOTE,
        isMain: false,
      },
      {
        id: "other-02",
        image: "/images/my-bag/other-02.png",
        alt: "Aren Visetos Crossbody Pouch",
        name: "Aren Visetos\nCrossbody Pouch",
        description:
          "넓고 슬림한 직사각형 실루엣으로\n가볍게 활용할 수 있는 크로스바디 파우치",
        materials: [
          "바디: 비세토스 코팅 캔버스",
          "트림: 천연 가죽",
          "안감: 패브릭",
          "하드웨어: 골드톤 메탈",
        ],
        note: SMART_MODULE_NOTE,
        isMain: false,
      },
    ],
  },
];
