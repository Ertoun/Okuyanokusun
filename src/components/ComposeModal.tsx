"use client";

import { useState } from "react";
import styles from "./ComposeModal.module.css";
import { X, Mic, Image as ImageIcon, Video } from "lucide-react";

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: "UserA" | "UserB";
  onSubmit: (data: any) => void;
}

export default function ComposeModal({ isOpen, onClose, currentUser, onSubmit }: ComposeModalProps) {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState(""); 
  const [mediaType, setMediaType] = useState<"image" | "video" | "audio" | null>(null);

  const [bgColor, setBgColor] = useState(currentUser === 'UserA' ? '#ffffff' : '#f0f0f0');
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('var(--font-inter)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = {
      author: currentUser,
      content,
      media: mediaUrl && mediaType ? [{ type: mediaType, url: mediaUrl }] : [],
      style: {
        backgroundColor: bgColor,
        textColor: textColor,
        fontFamily: fontFamily,
      },
    };
    onSubmit(newPost);
    setContent("");
    setMediaUrl("");
    setMediaType(null);
    // Reset to defaults or keep last used? Resetting for now.
    setBgColor(currentUser === 'UserA' ? '#ffffff' : '#f0f0f0');
    setTextColor('#000000');
    setFontFamily('var(--font-inter)');
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} style={{ backgroundColor: bgColor, color: textColor, fontFamily }}>
        <div className={styles.header}>
          <h2>New Entry as {currentUser}</h2>
          <button onClick={onClose} className={styles.closeBtn} style={{ color: textColor }}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={5}
            required
            style={{ backgroundColor: 'transparent', color: 'inherit', fontFamily: 'inherit', border: `1px solid ${textColor}40` }}
          />
          
          <div className={styles.mediaInput}>
            <input 
              type="text" 
              placeholder="Media URL (optional)" 
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className={styles.input}
              style={{ backgroundColor: 'transparent', color: 'inherit', borderColor: `${textColor}40` }}
            />
            <div className={styles.mediaTypeSelect}>
               <button type="button" onClick={() => setMediaType('image')} className={mediaType === 'image' ? styles.active : ''} style={{color: mediaType === 'image' ? '#fff' : textColor, borderColor: textColor}}><ImageIcon size={18}/></button>
               <button type="button" onClick={() => setMediaType('video')} className={mediaType === 'video' ? styles.active : ''} style={{color: mediaType === 'video' ? '#fff' : textColor, borderColor: textColor}}><Video size={18}/></button>
               <button type="button" onClick={() => setMediaType('audio')} className={mediaType === 'audio' ? styles.active : ''} style={{color: mediaType === 'audio' ? '#fff' : textColor, borderColor: textColor}}><Mic size={18}/></button>
            </div>
          </div>

          {mediaUrl && mediaType && (
            <div className={styles.mediaPreview}>
              {mediaType === 'image' && <img src={mediaUrl} alt="Preview" className={styles.previewImage} />}
              {mediaType === 'video' && <video src={mediaUrl} controls className={styles.previewVideo} />}
              {mediaType === 'audio' && <audio src={mediaUrl} controls className={styles.previewAudio} />}
            </div>
          )}

          <div className={styles.customizationControls}>
            <div className={styles.controlGroup}>
              <label>Bg</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
            </div>
            <div className={styles.controlGroup}>
              <label>Text</label>
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
            </div>
            <div className={styles.controlGroup}>
              <label>Font</label>
              <select 
                value={fontFamily} 
                onChange={(e) => setFontFamily(e.target.value)}
                style={{ backgroundColor: 'transparent', color: 'inherit', borderColor: `${textColor}40` }}
              >
                <option value="var(--font-inter)">Inter</option>
                <option value="var(--font-playfair)">Playfair</option>
                <option value="courier">Courier</option>
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn}>Post</button>
          </div>
        </form>
      </div>
    </div>
  );
}
