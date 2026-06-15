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
      zh: "什么是 N1NJ4 NFT？",
      en: "What is the N1NJ4 NFT?",
    },
    answer: {
      zh: "N1NJ4 Origins 是 Ninja Labs 推出的 500 枚像素赛博朋克忍者 NFT 集合，部署在 Injective EVM 上。每枚 NFT 都具有独立的图像、编号和特征，可作为 N1NJ4 社区中的链上身份标识。当前可使用的产品功能以本网站实际开放的页面为准。",
      en: "N1NJ4 Origins is a collection of 500 pixel-art cyberpunk ninja NFTs created by Ninja Labs and deployed on Injective EVM. Each NFT has its own image, number, and traits and can serve as an on-chain identity within the N1NJ4 community. Currently available features are limited to those that are live on this website.",
    },
  },
  {
    question: {
      zh: "Origins 目前是什么状态？",
      en: "What is the current status of Origins?",
    },
    answer: {
      zh: "Origins 共 500 枚，已经全部完成铸造，原始免费 mint 已结束。网站仍提供完整系列浏览和单枚 NFT 详情；如需购买，只能查看当前持有者在支持 Injective NFT 的二级市场上发布的挂单。",
      en: "All 500 Origins NFTs have been minted, and the original free mint has ended. You can still browse the full collection and individual NFT details on this site. To acquire one, check listings made by current holders on a secondary marketplace that supports Injective NFTs.",
    },
  },
  {
    question: {
      zh: "如何获得一个 Origins NFT？",
      en: "How can I get an Origins NFT?",
    },
    answer: {
      zh: (
        <>
          Origins 已无法在本站新铸造。目前可前往
          <a
            href="https://rarible.com/injective/collections/0x816070929010a3d202d8a6b89f92bee33b7e8769"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ee6a9e", textDecoration: "underline" }}
          >
            {" "}Rarible Origins 系列
          </a>
          {" "}查看是否有持有者挂单。价格、库存和成交条件由二级市场实时决定，请在签名前核对完整交易信息。
        </>
      ),
      en: (
        <>
          New Origins NFTs can no longer be minted on this site. Visit the
          <a
            href="https://rarible.com/injective/collections/0x816070929010a3d202d8a6b89f92bee33b7e8769"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ee6a9e", textDecoration: "underline" }}
          >
            {" "}Origins collection on Rarible
          </a>
          {" "}to see whether current holders have listed any NFTs. Price, availability, and transaction terms are determined by the secondary market, so review the full details before signing.
        </>
      ),
    },
  },
  {
    question: {
      zh: "N1NJ4 NFT 与 City Zero 是什么关系？",
      en: "How are N1NJ4 NFTs related to City Zero?",
    },
    answer: {
      zh: "Origins 是目前已经上线的 N1NJ4 NFT 系列。City Zero 是 Ninja Labs 围绕开发者身份、贡献记录和社区协作探索的后续产品方向。相关页面中展示的部分 Dashboard、治理、Grants、Growth Sharing 和 AI Residency 内容仍属于概念预览或开发计划，并不代表这些功能已经正式开放。",
      en: "Origins is the N1NJ4 NFT collection that is live today. City Zero is a broader product direction being explored by Ninja Labs around developer identity, contribution records, and community collaboration. Some dashboard, governance, grants, Growth Sharing, and AI Residency content shown on the site remains a concept preview or development plan and does not mean those features are already available.",
    },
  },
  {
    question: {
      zh: "N1NJ4 是 Injective 官方项目吗？",
      en: "Is N1NJ4 an official Injective project?",
    },
    answer: {
      zh: "N1NJ4 是由 Ninja Labs 独立发起的项目，使用 Injective EVM 作为底层网络。它不代表 Injective Labs 或 Injective Foundation，也不应与其他名称中包含 Ninja 的 Injective 生态项目视为同一项目。",
      en: "N1NJ4 is an independent project initiated by Ninja Labs and uses Injective EVM as its underlying network. It does not represent Injective Labs or the Injective Foundation and should not be treated as the same project as other Injective ecosystem products that use the name Ninja.",
    },
  },
  {
    question: {
      zh: "NFT 存储在哪里？它是 ERC-721 吗？",
      en: "Where is the NFT stored, and is it ERC-721?",
    },
    answer: {
      zh: (
        <>
          Origins 的图像和元数据使用 IPFS 内容地址存储，长期可访问性仍取决于 IPFS 网络和 pinning 服务。合约部署在 Injective EVM（Chain ID 1776），并提供 ERC-721 标准的所有权、转移和 tokenURI 查询接口。合约地址为
          <a
            href="https://blockscout.injective.network/address/0x816070929010a3d202d8a6b89f92bee33b7e8769"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ee6a9e", textDecoration: "underline" }}
          >
            {" "}0x8160...8769
          </a>
          。
        </>
      ),
      en: (
        <>
          Origins images and metadata use IPFS content addresses. Long-term availability still depends on the IPFS network and pinning services. The contract is deployed on Injective EVM (Chain ID 1776) and exposes standard ERC-721 ownership, transfer, and tokenURI interfaces. The contract address is
          <a
            href="https://blockscout.injective.network/address/0x816070929010a3d202d8a6b89f92bee33b7e8769"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ee6a9e", textDecoration: "underline" }}
          >
            {" "}0x8160...8769
          </a>
          .
        </>
      ),
    },
  },
  {
    question: {
      zh: "购买或转移 NFT 会产生哪些费用？",
      en: "What fees may apply when buying or transferring an NFT?",
    },
    answer: {
      zh: "Origins 的原始免费 mint 已结束。当前在二级市场购买或转移 NFT 时，可能需要支付 Injective 网络 Gas，并可能涉及市场服务费或创作者版税。实际金额由交易平台和当时的链上条件决定，请以钱包签名前显示的明细为准。",
      en: "The original free mint for Origins has ended. Buying or transferring an NFT on a secondary market may require Injective network gas and may also involve marketplace fees or creator royalties. The actual amount depends on the marketplace and current network conditions, so rely on the transaction breakdown shown before you sign.",
    },
  },
  {
    question: {
      zh: "Cyber Ronin、Grants、治理和 AI Residency 何时开放？",
      en: "When will Cyber Ronin, grants, governance, and AI Residency launch?",
    },
    answer: {
      zh: "这些内容属于 N1NJ4 与 City Zero 的后续方向，目前没有在本网站正式开放。发布日期、参与资格、合约、费用和具体规则均以 Ninja Labs 的正式公告及实际上线页面为准。请不要将概念页面或路线图描述视为已经生效的权益。",
      en: "These are future directions for N1NJ4 and City Zero and are not currently live on this website. Launch dates, eligibility, contracts, fees, and detailed rules will be confirmed through official Ninja Labs announcements and live product pages. Concept previews and roadmap descriptions should not be treated as active benefits.",
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
