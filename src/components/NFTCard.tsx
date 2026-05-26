import { Link } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import "./NFTCard.css";

type NFTLevel = "white" | "purple";

interface NFTCardProps {
  id: number;
  linkId?: number;
  name: string;
  image: string;
  owner?: string;
  level: NFTLevel;
  attributes?: string[];
}

function NFTCard({
  id,
  linkId,
  name,
  image,
  owner,
  level,
  attributes,
}: NFTCardProps) {
  const { language } = useLanguage();

  return (
    <Link to={`/nft/${linkId ?? id}`} className="nft-card-link">
      <div className={`nft-card level-${level}`}>
        <div className="nft-card-image-wrapper">
          <div className="nft-card-image">
            <img src={image} alt={name} className="nft-image-display" />
          </div>
        </div>

        <div className="nft-card-content">
          <div className="nft-card-header">
            <h3 className="nft-name">{name}</h3>
            <p className="nft-id">#{id}</p>
          </div>

          {attributes && attributes.length > 0 && (
            <div className="nft-attributes">
              {attributes.slice(0, 2).map((attr, index) => (
                <span key={index} className="attribute-tag">
                  {attr}
                </span>
              ))}
            </div>
          )}

          {owner && (
            <div className="nft-owner-section">
              <span className="owner-label">
                {language === "zh" ? "持有者" : "Owner"}
              </span>
              <span className="owner-address">
                {owner.slice(0, 6)}...{owner.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default NFTCard;
