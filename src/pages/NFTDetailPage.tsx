import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../context/useLanguage";
import imagesSummary from "../abi/images_summary.json" assert { type: "json" };
import config from "../config";

type Attribute = {
  trait_type: string;
  value: string;
};

type Metadata = {
  name: string;
  description: string;
  image: string;
  edition?: number;
  attributes: Attribute[];
};

type SummaryEntry = {
  edition: number;
  image: string;
  metadata?: string;
};

const summaryEntries = imagesSummary as SummaryEntry[];

const resolveIpfsUrl = (url?: string) =>
  url?.startsWith("ipfs://") ? `https://ipfs.io/ipfs/${url.slice(7)}` : url;

type ErrorKey = "missingId" | "notFound" | "loadFailed" | null;

function NFTDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [errorKey, setErrorKey] = useState<ErrorKey>(null);
  const { language } = useLanguage();
  const translate = (zh: string, en: string) => (language === "zh" ? zh : en);
  const getErrorMessage = (key: Exclude<ErrorKey, null>) => {
    switch (key) {
      case "missingId":
        return translate("未指定 NFT ID", "NFT ID not provided");
      case "notFound":
        return translate(
          "未找到对应的 NFT 数据",
          "No metadata found for this NFT"
        );
      case "loadFailed":
      default:
        return translate("加载 NFT 数据失败", "Failed to load NFT data");
    }
  };

  const editionNumber = useMemo(() => (id ? Number(id) : NaN), [id]);

  const summaryEntry = useMemo(() => {
    if (!Number.isFinite(editionNumber)) return null;
    return (
      summaryEntries.find((entry) => entry.edition === editionNumber) || null
    );
  }, [editionNumber]);

  useEffect(() => {
    if (!id) {
      setErrorKey("missingId");
      setMetadata(null);
      return;
    }

    if (!summaryEntry) {
      setErrorKey("notFound");
      setMetadata(null);
      return;
    }

    const metadataUrl = resolveIpfsUrl(summaryEntry.metadata);
    if (!metadataUrl) {
      setErrorKey("loadFailed");
      setMetadata(null);
      return;
    }

    let cancelled = false;

    const fetchMetadata = async () => {
      try {
        const response = await fetch(metadataUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata: ${response.status}`);
        }
        const data = (await response.json()) as Metadata;
        if (!cancelled) {
          setMetadata(data);
          setErrorKey(null);
        }
      } catch (err) {
        console.error("加载 NFT metadata 失败:", err);
        if (!cancelled) {
          setMetadata(null);
          setErrorKey("loadFailed");
        }
      }
    };

    fetchMetadata();

    return () => {
      cancelled = true;
    };
  }, [id, summaryEntry]);

  const displayImage = useMemo(
    () =>
      metadata?.image
        ? resolveIpfsUrl(metadata.image)
        : resolveIpfsUrl(summaryEntry?.image) || "",
    [metadata, summaryEntry]
  );

  if (errorKey) {
    return (
      <div className="page-wrapper section">
        <div className="container text-center">
          <h1 className="title title-xl mb-md">{getErrorMessage(errorKey)}</h1>
          <Link to="/gallery" className="btn btn-primary">
            {translate("返回画廊", "Back to Gallery")}
          </Link>
        </div>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="page-wrapper section">
        <div className="container text-center">
          <h1 className="title title-xl mb-md">
            {translate("加载中...", "Loading...")}
          </h1>
        </div>
      </div>
    );
  }

  const tierAttribute =
    metadata.attributes.find((attr) => attr.trait_type === "Tier") || null;
  const otherAttributes = metadata.attributes.filter(
    (attr) => attr.trait_type !== "Tier"
  );

  return (
    <div className="page-wrapper section">
      <div className="container">
        <div className="mb-lg">
          <Link
            to="/gallery"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: "600",
            }}
          >
            ← {translate("返回画廊", "Back to Gallery")}
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: "100px",
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            <div
              className="card"
              style={{
                padding: "0",
                aspectRatio: "1",
                overflow: "hidden",
                width: "100%",
              }}
            >
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={metadata.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-secondary)",
                  }}
                >
                  {translate("无图片数据", "No image data")}
                </div>
              )}
            </div>
          </div>

          <div className="flex-col gap-lg">
            <div
              style={{
                borderBottom: "1px solid var(--border-color)",
                paddingBottom: "24px",
              }}
            >
              <h1 className="title title-xl mb-sm">{metadata.name}</h1>
            </div>

            <div
              style={{
                padding: "16px 0",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <h1
                className="text-sm font-bold text-primary mb-md"
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {translate("属性", "Attributes")}
              </h1>
              <div className="flex-col gap-sm">
                {tierAttribute ? (
                  <div
                    className="card text-center p-md"
                    style={{ width: "100%" }}
                  >
                    <p
                      className="text-xs text-tertiary mb-xs"
                      style={{
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {tierAttribute.trait_type}
                    </p>
                    <p className="text-base font-semibold text-primary">
                      {tierAttribute.value}
                    </p>
                  </div>
                ) : null}
                <div className="nft-attributes-grid gap-sm">
                  {otherAttributes.map((attr, index) => (
                    <div
                      key={`${attr.trait_type}-${index}`}
                      className="card text-center p-md"
                    >
                      <p
                        className="text-xs text-tertiary mb-xs"
                        style={{
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {attr.trait_type}
                      </p>
                      <p className="text-base font-semibold text-primary">
                        {attr.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "16px 0",
                borderBottom: "1px solid var(--border-color)",
              }}
            >
              <h3
                className="text-sm font-bold text-primary mb-md"
                style={{ textTransform: "uppercase", letterSpacing: "1px" }}
              >
                {translate("简介", "Description")}
              </h3>
              <p
                className="text-base text-secondary"
                style={{ lineHeight: "1.7" }}
              >
                {metadata.description}
              </p>
            </div>

            <div className="mt-md">
              <button
                className="btn btn-primary btn-lg"
                style={{ width: "100%" }}
                onClick={() => {
                  const url = `${config.chain.explorer}/token/${config.nft.contractAddress}/instance/${editionNumber}`;
                  window.open(url, "_blank");
                }}
              >
                {translate("在区块链上查看", "View on-chain")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTDetailPage;
