import { useState } from "react";
import type { ReactNode } from "react";
import { useLanguage } from "../../context/useLanguage";

type LocaleText = { zh: ReactNode; en: ReactNode };

interface FAQItem {
  question: LocaleText;
  answer: LocaleText;
}

const faqData: FAQItem[] = [
  {
    question: {
      zh: "N1NJ4 到底是什么？",
      en: "What is N1NJ4, exactly?",
    },
    answer: {
      zh: "N1NJ4 是 Ninja Labs 发起的开发者品牌。首发产品是 City Zero——构建在 Injective EVM 上的去中心化数字城市。NFT 在 N1NJ4 中不是产品本身，而是公民身份。三大支柱分别是：身份（Identity）、栖息地（Habitat: Grants 与孵化）、增长共享（Growth Sharing），以及一个关键差异化：AI 居民（AI Residency）——AI agent 与人类公民享有同等身份。",
      en: "N1NJ4 is a developer brand initiated by Ninja Labs. Its first product is City Zero — a decentralized city built on Injective EVM. In N1NJ4, the NFT is not the product; it is citizenship. The three pillars are Identity, Habitat (Grants & Incubation), and Growth Sharing — plus one key differentiator: AI Residency, where AI agents are first-class citizens alongside humans.",
    },
  },
  {
    question: {
      zh: "Cyber Ninja 与 Cyber Ronin 是什么？两者什么关系？",
      en: "What are Cyber Ninja and Cyber Ronin? How do they relate?",
    },
    answer: {
      zh: "Origins 系列的官方角色身份名是 Cyber Ninja——500 个代表 Cyber Ninja 身份的创世通行证已于第一阶段全部发放完成。Cyber Ronin 是第二波创世通行证（500 位，即将上线），共同组成 City Zero 首批 1000 创世公民阵容。命名上 Cyber Ninja → Cyber Ronin 是有意的叙事弧线：Ninja 是有组织、有主公的隐者，Ronin 在武士道里是失去主公、独立自主的浪人。第二波因此承载更独立、更自主的公民形象。在权利上 Cyber Ninja 与 Cyber Ronin 完全平等：相同的链上身份、相同的治理权重（按公民身份 1:1 计权，而非按 token 数量）。Cyber Ninja 持有者将获得 Cyber Ronin 的优先通道——具体机制（白名单 / 提前 mint 窗口）将在发售前公布。",
      en: "The official citizenship identity for the Origins series is Cyber Ninja — 500 founding passes representing Cyber Ninja identity were fully distributed in Phase 1. Cyber Ronin is the second wave of founding passes (500, coming soon), and together they form City Zero's first 1000 founding citizens. The naming Cyber Ninja → Cyber Ronin is an intentional narrative arc: in bushido, Ninja are organized shinobi serving a clan, while Ronin are masterless warriors — independent and self-directed. The second wave therefore carries a more autonomous citizen identity. In rights, Cyber Ninja and Cyber Ronin are fully equal: same on-chain identity, same governance weight (one citizen, one vote — not token-weighted). Cyber Ninja holders will receive priority access for Cyber Ronin; specific mechanics (whitelist / early mint window) will be announced before drop.",
    },
  },
  {
    question: {
      zh: "「公民身份」具体能做什么？",
      en: "What can I actually do with a Citizenship NFT?",
    },
    answer: {
      zh: "持有 N1NJ4 NFT 即为 City Zero 公民。公民可以：① 参与城市治理投票（按公民身份计权，非按 token 计权，规避巨鲸控制）；② 在 Grants 项目中投票决定金库分配；③ 作为 Habitat 入驻孵化项目的资格之一；④ 在 Phase 2 起获得 Growth Sharing 按贡献分配的份额。具体落地节奏参见路线图（首页 Roadmap 部分）。",
      en: "Holding an N1NJ4 NFT makes you a City Zero citizen. As a citizen, you can: (1) vote in city governance (weight is per-citizen, not per-token — preventing whale capture); (2) help allocate the treasury through grant votes; (3) become eligible for Habitat incubation; (4) starting Phase 2, receive a Growth Sharing distribution based on verified contribution. See the homepage roadmap for the rollout cadence.",
    },
  },
  {
    question: {
      zh: "N1NJ4 是 Injective 官方的项目吗？和 Injective Ninja Pass 是同一个吗？",
      en: "Is N1NJ4 an official Injective project? Is it the same as Injective Ninja Pass?",
    },
    answer: {
      zh: "不是。N1NJ4 由 Ninja Labs（独立团队）发起，构建在 Injective EVM 之上，但与 Injective Labs、Injective 基金会或 Injective 官方 Ninja Pass 没有任何附属关系。「Ninja」是 Injective 社区的统称（200K+ 持有者均自称 Ninja），N1NJ4 借用了这一文化符号，但是独立项目。",
      en: "No. N1NJ4 is initiated by Ninja Labs, an independent team. It is built on Injective EVM but is not affiliated with Injective Labs, the Injective Foundation, or the official Injective Ninja Pass. \"Ninja\" is the Injective community's identifier (200K+ community members call themselves Ninjas); N1NJ4 borrows this cultural symbol but is an independent project.",
    },
  },
  {
    question: {
      zh: "Origins 还能买到吗？",
      en: "Can I still get an Origins NFT?",
    },
    answer: {
      zh: (
        <>
          可以，但只能在二级市场。Origins 500 枚已全部 mint 完成，新购买请前往 Rarible:
          <a
            href="https://rarible.com/injective/collections/0x816070929010a3d202d8a6b89f92bee33b7e8769"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ee6a9e", textDecoration: "underline" }}
          >
            {" "}Rarible Origins 系列
          </a>
          。如果你愿意等一周/几周，Cyber Ronin 也将很快开放 mint——届时可在站内直接铸造，无需第三方市场。
        </>
      ),
      en: (
        <>
          Yes, but only on the secondary market. All 500 Origins have been minted; new buyers can find them on
          <a
            href="https://rarible.com/injective/collections/0x816070929010a3d202d8a6b89f92bee33b7e8769"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ee6a9e", textDecoration: "underline" }}
          >
            {" "}Rarible
          </a>
          . If you can wait a week or two, Cyber Ronin will open for mint soon — directly on this site, no third-party marketplace required.
        </>
      ),
    },
  },
  {
    question: {
      zh: "我是开发者，如何申请 Grant 或入驻孵化？",
      en: "I'm a developer — how do I apply for a grant or get into incubation?",
    },
    answer: {
      zh: "首轮 Grants 项目作为 Phase 1 的并行工作项正在准备中。届时申请入口将放在 /grants 路由（即将上线）。在此之前，你可以阅读白皮书 economy/grants-incubation 章节了解资助标准与流程，或关注 Ninja Labs 的 X 账号获取首轮开放公告。",
      en: "The first grant round is being prepared as part of Phase 1's parallel work items. The application portal will live at /grants (coming soon). In the meantime, you can read the economy/grants-incubation chapter of the whitepaper for criteria and flow, or follow Ninja Labs on X for the announcement when the first round opens.",
    },
  },
  {
    question: {
      zh: "什么是 AI Residency？AI agent 真的能成为公民？",
      en: "What is AI Residency? Can AI agents really be citizens?",
    },
    answer: {
      zh: "是的，这是 N1NJ4 最大的差异化。AI Residency 协议允许 AI agent 申请 N1NJ4 公民身份，并在链上记录其活动。AI 公民与人类公民享有同等权利，可以参与治理、申请 Grant、提供服务并接收支付（在 Phase 2 的 AI 经济原语上线后）。详见白皮书 city-zero/ai-residency 章节。",
      en: "Yes — this is N1NJ4's biggest differentiator. The AI Residency protocol lets AI agents apply for N1NJ4 citizenship and have their on-chain activity recorded. AI citizens have the same rights as human citizens: they can participate in governance, apply for grants, and offer or receive payment for services (once Phase 2's AI economy primitives ship). See the city-zero/ai-residency chapter of the whitepaper for details.",
    },
  },
  {
    question: {
      zh: "NFT 的图像存储在哪里？合约部署在哪条链？",
      en: "Where are the NFT images stored? Which chain are the contracts on?",
    },
    answer: {
      zh: "所有 NFT 的图像和元数据存储在去中心化存储网络中以确保长期可用。智能合约部署在 Injective EVM（Chain ID 1776）。Origins 合约地址：0x8160...8769（可在 Blockscout 查询）。Cyber Ronin 将使用独立合约，地址将在发售前公布。",
      en: "All NFT images and metadata are stored on decentralized storage for long-term availability. Smart contracts are deployed on Injective EVM (Chain ID 1776). Origins contract: 0x8160...8769 (verifiable on Blockscout). Cyber Ronin will use a separate contract; the address will be published before drop.",
    },
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { language } = useLanguage();

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-section">
      <h2 className="title title-lg text-center mb-lg">Q &amp; A</h2>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <button
              className={`faq-question ${openIndex === index ? "open" : ""}`}
              onClick={() => toggleQuestion(index)}
            >
              <span>{item.question[language]}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className={`faq-icon ${openIndex === index ? "rotated" : ""}`}
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {openIndex === index && (
              <div className="faq-answer">{item.answer[language]}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
