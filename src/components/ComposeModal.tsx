import { useState, useEffect } from "react";
import styles from "./ComposeModal.module.css";
import { X, Mic, Image as ImageIcon, Video } from "lucide-react";
import { UserType, PostData } from "@/types/post";

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType;
  onSubmit: (data: any) => void;
  initialData?: PostData | null;
}

export default function ComposeModal({ isOpen, onClose, currentUser, onSubmit, initialData }: ComposeModalProps) {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState(""); 
  const [mediaType, setMediaType] = useState<"image" | "video" | "audio" | null>(null);

  const [bgColor, setBgColor] = useState(currentUser === 'Sude' ? '#ffffff' : '#f0f0f0');
  const [textColor, setTextColor] = useState('#000000');
  const [fontFamily, setFontFamily] = useState('var(--font-inter)');
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content);
      if (initialData.media && initialData.media.length > 0) {
        setMediaUrl(initialData.media[0].url);
        setMediaType(initialData.media[0].type);
      } else {
        setMediaUrl("");
        setMediaType(null);
      }
      setBgColor(initialData.style.backgroundColor);
      setTextColor(initialData.style.textColor);
      setFontFamily(initialData.style.fontFamily);
      setBgImage(initialData.style.backgroundImage || "");
    } else {
      setContent("");
      setMediaUrl("");
      setMediaType(null);
      setBgColor(currentUser === 'Sude' ? '#ffffff' : '#f0f0f0');
      setTextColor('#000000');
      setFontFamily('var(--font-inter)');
      setBgImage("");
    }
  }, [initialData, currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      _id: initialData?._id,
      author: currentUser,
      content,
      media: mediaUrl && mediaType ? [{ type: mediaType, url: mediaUrl }] : [],
      style: {
        backgroundColor: bgColor,
        textColor: textColor,
        fontFamily: fontFamily,
        backgroundImage: bgImage || undefined,
      },
    };
    onSubmit(postData);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div 
        className={styles.modal} 
        style={{ 
          backgroundColor: bgColor, 
          color: textColor, 
          fontFamily,
          backgroundImage: bgImage ? `url(${bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className={styles.header}>
          <h2>{initialData ? 'Edit Entry' : 'New Entry'} as {currentUser}</h2>
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
            style={{ backgroundColor: bgImage || bgColor !== '#ffffff' ? 'rgba(255,255,255,0.7)' : 'transparent', color: 'inherit', fontFamily: 'inherit', border: `1px solid ${textColor}40` }}
          />
          
          <div className={styles.mediaInput}>
            <input 
              type="text" 
              placeholder="Media URL (optional)" 
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className={styles.input}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'inherit', borderColor: `${textColor}40` }}
            />
            <div className={styles.mediaTypeSelect}>
               <button type="button" onClick={() => setMediaType('image')} className={mediaType === 'image' ? styles.active : ''} style={{color: mediaType === 'image' ? '#fff' : textColor, borderColor: textColor}}><ImageIcon size={18}/></button>
               <button type="button" onClick={() => setMediaType('video')} className={mediaType === 'video' ? styles.active : ''} style={{color: mediaType === 'video' ? '#fff' : textColor, borderColor: textColor}}><Video size={18}/></button>
               <button type="button" onClick={() => setMediaType('audio')} className={mediaType === 'audio' ? styles.active : ''} style={{color: mediaType === 'audio' ? '#fff' : textColor, borderColor: textColor}}><Mic size={18}/></button>
            </div>
          </div>

          <div className={styles.customizationControls}>
            <div className={styles.controlGroup}>
              <label>Bg</label>
              <div className={styles.colorPickerGroup}>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                <input 
                  type="text" 
                  value={bgColor} 
                  onChange={(e) => setBgColor(e.target.value)} 
                  className={styles.hexInput}
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
            <div className={styles.controlGroup}>
              <label>Text</label>
              <div className={styles.colorPickerGroup}>
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                <input 
                  type="text" 
                  value={textColor} 
                  onChange={(e) => setTextColor(e.target.value)} 
                  className={styles.hexInput}
                  placeholder="#000000"
                />
              </div>
            </div>
            <div className={styles.controlGroup}>
              <label>Font</label>
              <select 
                value={fontFamily} 
                onChange={(e) => setFontFamily(e.target.value)}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'inherit', borderColor: `${textColor}40` }}
                className={styles.select}
              >
                <option value="var(--font-inter)">Inter</option>
                <option value="var(--font-playfair)">Playfair</option>
                <option value="courier">Courier</option>
              </select>
            </div>
          </div>

          <div className={styles.controlGroup} style={{ width: '100%', marginTop: '0.5rem' }}>
            <label style={{ marginRight: '0.5rem' }}>Bg Image URL</label>
            <input 
              type="text" 
              placeholder="Paste image URL for post background" 
              value={bgImage}
              onChange={(e) => setBgImage(e.target.value)}
              className={styles.input}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'inherit', borderColor: `${textColor}40` }}
            />
          </div>

          {mediaUrl && mediaType && (
            <div className={styles.mediaPreview}>
              {mediaType === 'image' && <img src={mediaUrl} alt="Preview" className={styles.previewImage} />}
              {mediaType === 'video' && <video src={mediaUrl} controls className={styles.previewVideo} />}
              {mediaType === 'audio' && <audio src={mediaUrl} controls className={styles.previewAudio} />}
            </div>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn}>Post</button>
          </div>
        </form>
      </div>
    </div>
  );
}
