import { Link } from "react-router-dom";
import { useMemo } from "react";
import imagesSummary from "../../abi/images_summary.json" assert { type: "json" };
import filterMap from "../../abi/filter_map.json" assert { type: "json" };

type NFTLevel = "white" | "purple";

const extractNftNumber = (imageUrl: string): number => {
  const match = imageUrl.match(/\/(\d+)\.png/);
  return match ? parseInt(match[1]) : 0;
};

interface NFT {
  id: number;
  visualId: number;
  name: string;
  image: string;
  level: NFTLevel;
}

interface NFTShowcaseProps {
  count?: number;
}

const resolveImageUrl = (image: string) =>
  image.startsWith("ipfs://")
    ? `https://ipfs.io/ipfs/${image.slice(7)}`
    : image;

function NFTShowcase({ count = 18 }: NFTShowcaseProps) {
  const rareSet = useMemo(() => {
    const rareList =
      (filterMap as Record<string, Record<string, number[]>>)?.["Tier"]?.[
        "Rare"
      ] || [];
    return new Set(rareList);
  }, []);

  const allNFTs: NFT[] = useMemo(() => {
    const list = (
      imagesSummary as Array<{ edition: number; image: string }>
    ).map(({ edition, image }) => {
      const level: NFTLevel = rareSet.has(edition) ? "purple" : "white";
      const visualId = extractNftNumber(image);
      return {
        id: edition,
        visualId,
        name: `NINJ4 #${visualId}`,
        image: resolveImageUrl(image),
        level,
      };
    });
    return list;
  }, [rareSet]);

  const showcaseNFTs: NFT[] = useMemo(() => {
    // 随机打乱数组的辅助函数
    const shuffle = <T,>(array: T[]) => {
      const newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };

    return shuffle(allNFTs).slice(0, count);
  }, [allNFTs, count]);

  return (
    <div className="nft-showcase">
      <div className="nft-showcase-grid">
        {showcaseNFTs.map((nft) => {
          const content = (
            <>
              <img src={nft.image} alt={nft.name} loading="lazy" />
              <span className="nft-showcase-id">#{nft.visualId}</span>
            </>
          );

          return (
            <Link
              key={nft.id}
              to={`/nft/${nft.id}`}
              className={`nft-showcase-item level-${nft.level}`}
              title={nft.name}
            >
              {content}
            </Link>
          );
        })}
      </div>
      <div className="nft-showcase-header">
        <a
          href="https://rarible.com/injective/collections/0x816070929010a3d202d8a6b89f92bee33b7e8769"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-rarible"
        >
          Buy on Rarible →
        </a>
        <Link to="/gallery" className="btn btn-outline btn-sm">
          View All 500 Ninjas →
        </Link>
      </div>
    </div>
  );
}

export default NFTShowcase;
