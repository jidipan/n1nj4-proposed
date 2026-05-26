import React, { useState } from "react";
import { createPortal } from "react-dom";
import type { KeyboardEvent } from "react";
import "./SubmitProjectModal.css";
import { useLanguage } from "../../context/useLanguage";

interface SubmitProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubmitProjectModal: React.FC<SubmitProjectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const translate = (zh: string, en: string) => (isZh ? zh : en);

  const [repoUrl, setRepoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");

  // Tags state
  const [tags, setTags] = useState<string[]>(["Python", "React"]);
  const [tagInput, setTagInput] = useState("");

  // Socials state
  const [socials, setSocials] = useState([{ platform: "Github", text: "" }]);

  if (!isOpen) return null;

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 阻止回车提交表单
      const newTag = tagInput.trim();
      if (newTag) {
        // 只有当不超过6个且不重复时才加入标签组
        if (tags.length < 6 && !tags.includes(newTag)) {
          setTags([...tags, newTag]);
        }
        // 只要按下回车，且框内有字，无论是否成功加入，都清空输入框
        setTagInput("");
      }
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleAddSocial = () => {
    setSocials([...socials, { platform: "Github", text: "" }]);
  };

  const removeSocial = (indexToRemove: number) => {
    setSocials(socials.filter((_, index) => index !== indexToRemove));
  };

  const updateSocial = (
    index: number,
    field: "platform" | "text",
    value: string,
  ) => {
    const newSocials = [...socials];
    newSocials[index][field] = value;
    setSocials(newSocials);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const googleSheetUrl = import.meta.env.VITE_GOOGLE_SHEET_API;
    if (!googleSheetUrl) {
      alert(
        translate(
          "VITE_GOOGLE_SHEET_API 环境变量未配置！请确保 .env 中已经写入该地址。",
          "VITE_GOOGLE_SHEET_API is not configured. Please set it in your .env.",
        ),
      );
      return;
    }

    try {
      const response = await fetch(googleSheetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          repoUrl: repoUrl,
          description: description,
          keyFeatures: keyFeatures,
          techTags: tags.join(", "),
          socialMedia: JSON.stringify(socials), // Convert array of objects to string
        }),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert(
          translate(
            "提交成功！项目信息已写入你的 Google Sheet，审批后即可展示。",
            "Submitted successfully! Your project has been written to Google Sheet and will be shown after approval.",
          ),
        );
        // Reset form fields
        setRepoUrl("");
        setDescription("");
        setKeyFeatures("");
        setTags(["Python", "React"]);
        setSocials([{ platform: "Github", text: "" }]);
        onClose(); // Close the modal
      } else {
        alert(translate("提交写入失败: ", "Submit failed: ") + result.message);
      }
    } catch (error) {
      console.error("发送失败:", error);
      alert(
        translate(
          "网络或跨域错误，提交失败！",
          "Network or CORS error. Submission failed.",
        ),
      );
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <div className="modal-rocket-icon">🚀</div>
            <h2 className="modal-title">
              {translate(
                "AI 体验项目 · City Zero",
                "AI Experience Project · City Zero",
              )}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          {/* Section 1 */}
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-step-badge">1</div>
              <div className="form-section-title-wrapper">
                <h3 className="form-section-title">
                  {translate("仓库地址", "Repository URL")}
                </h3>
                <div className="form-section-subtitle">
                  {translate(
                    "必须是公开的 GitHub 或 GitLab 仓库",
                    "Must be a public GitHub or GitLab repository",
                  )}
                </div>
              </div>
              <div className="char-count">
                {translate("必填", "Required")}
                <br />
                {repoUrl.length} / 120
              </div>
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="https://github.com/yourname/your-project"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value.substring(0, 120))}
              required
            />
          </div>

          <div className="form-divider"></div>

          {/* Section 2 */}
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-step-badge">2</div>
              <div className="form-section-title-wrapper">
                <h3 className="form-section-title">
                  {translate("简短描述", "Short description")}
                </h3>
                <div className="form-section-subtitle">
                  {translate(
                    "你的 AI 项目做什么？这段会显示在项目卡片上。",
                    "What does your AI agent do? Shown on the project card.",
                  )}
                </div>
              </div>
              <div className="char-count">{description.length} / 120</div>
            </div>
            <textarea
              className="form-textarea"
              placeholder="A pixel-art AI agent that visualizes autonomous work states in a cozy office environment..."
              value={description}
              onChange={(e) => setDescription(e.target.value.substring(0, 120))}
            />
          </div>

          <div className="form-divider"></div>

          {/* Section 3 */}
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-step-badge">3</div>
              <div className="form-section-title-wrapper">
                <h3 className="form-section-title">
                  {translate("技术栈标签", "Tech stack tags")}
                </h3>
                <div className="form-section-subtitle">
                  {translate(
                    "输入标签后按回车，或点击下方建议标签",
                    "Type a tag and press Enter, or click a suggestion below",
                  )}
                </div>
              </div>
              <div className="char-count">
                {translate("最多 6 个标签", "Up to 6 tags")}
              </div>
            </div>
            <div className="tags-split-container">
              <div className="tags-left-pane">
                {tags.map((tag, idx) => (
                  <span key={idx} className="tag-pill">
                    {tag}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => removeTag(idx)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="tags-right-pane">
                <input
                  type="text"
                  className="tag-text-input-new"
                  placeholder={translate("添加标签...", "Add tag...")}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  disabled={tags.length >= 6}
                />
              </div>
            </div>
          </div>

          <div className="form-divider"></div>

          {/* Section 4 */}
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-step-badge">4</div>
              <div className="form-section-title-wrapper">
                <h3 className="form-section-title">
                  {translate("核心功能", "Key features")}
                </h3>
                <div className="form-section-subtitle">
                  {translate(
                    "请为详情页的 KEY FEATURES 区域填写一段完整说明",
                    "Write one complete paragraph for the detail page KEY FEATURES section",
                  )}
                </div>
              </div>
              <div className="char-count">{keyFeatures.length} / 600</div>
            </div>
            <textarea
              className="form-textarea"
              placeholder={translate(
                "请用一段话描述项目的关键能力，包括亮点、流程与实际价值。",
                "Describe the project's key capabilities in one paragraph, including highlights, workflow, and practical value.",
              )}
              value={keyFeatures}
              onChange={(e) => setKeyFeatures(e.target.value.substring(0, 600))}
            />
          </div>

          <div className="form-divider"></div>

          {/* Section 5 */}
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-step-badge">5</div>
              <div className="form-section-title-wrapper">
                <h3 className="form-section-title">
                  {translate("社交媒体", "Social Media")}
                </h3>
                <div className="form-section-subtitle">
                  {translate(
                    "添加你的社交账号，方便社区关注你的项目进展",
                    "Add your social accounts so the community can follow your work",
                  )}
                </div>
              </div>
              <div className="char-count">{translate("可选", "Optional")}</div>
            </div>

            <div className="socials-list">
              {socials.map((social, idx) => (
                <div className="social-row" key={idx}>
                  <div className="social-select-wrapper">
                    <select
                      className="social-select"
                      value={social.platform}
                      onChange={(e) =>
                        updateSocial(idx, "platform", e.target.value)
                      }
                    >
                      <option value="Github">Github</option>
                      <option value="X">X (Twitter)</option>
                      <option value="Discord">Discord</option>
                      <option value="Website">
                        {translate("网站", "Website")}
                      </option>
                    </select>
                  </div>
                  <div className="social-input-wrapper">
                    <div className="social-prefix">
                      {social.platform === "Github"
                        ? "github.com/"
                        : social.platform === "X"
                          ? "x.com/"
                          : ""}
                    </div>
                    <input
                      type="text"
                      className="social-text-input"
                      placeholder={translate("你的账号名", "yourusername")}
                      value={social.text}
                      onChange={(e) =>
                        updateSocial(idx, "text", e.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className="social-remove-btn"
                    onClick={() => removeSocial(idx)}
                    title={translate("移除该平台", "Remove platform")}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="add-social-btn"
              onClick={handleAddSocial}
            >
              + {translate("添加其他平台", "Add another platform")}
            </button>
          </div>

          {/* Info Alert */}
          <div className="info-alert">
            <div className="info-icon">i</div>
            <div className="info-text">
              {translate(
                "提交后项目会经过 Ninja Labs 团队的简要审核。通过审核的项目会展示在 City Zero 的 AI Experience Project 区域，通常需要 3-5 个工作日。",
                "Submitted projects go through a brief review by the Ninja Labs team. Approved projects are featured on the City Zero AI Experience Project section — usually within 3-5 working days.",
              )}
            </div>
          </div>

          {/* Footer / Actions */}
          <div className="modal-footer">
            <div className="footer-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                {translate("取消", "Cancel")}
              </button>
              <button type="submit" className="submit-review-btn">
                {translate("提交审核", "Submit for review")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default SubmitProjectModal;
