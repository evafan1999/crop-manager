import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreateCropForm({ onClose, onCropCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "蔬菜",
    planting_date: null,
    harvest_date: null,
    actual_harvest_date: null,
    yield_: "",
    area: "A區",
    origin: "市場買的苗",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const toAD = (dateObj) => {
    if (!dateObj) return "";
    const y = dateObj.getFullYear();
    const m = dateObj.getMonth() + 1;
    const d = dateObj.getDate();
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...formData,
      planting_date: toAD(formData.planting_date),
      harvest_date: toAD(formData.harvest_date),
      actual_harvest_date: formData.actual_harvest_date ? toAD(formData.actual_harvest_date) : "",
    };

    if (!payload.name || !payload.planting_date) {
      setError("請填寫作物名稱與種植日期");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const crop = await res.json();
        if (images.length > 0) {
          const formData = new FormData();
          images.forEach((img) => formData.append("files", img));
          await fetch(`http://localhost:8000/api/upload/${crop.id}`, {
            method: "POST",
            body: formData,
          });
        }
        toast.success("新增成功");
        onCropCreated();
        onClose();
      } else {
        const result = await res.json();
        toast.error(result.detail || "新增失敗");
      }
    } catch (err) {
      toast.error("連線失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewUrls(files.map((f) => URL.createObjectURL(f)));
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = [...images];
    const updatedPreviews = [...previewUrls];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImages(updatedFiles);
    setPreviewUrls(updatedPreviews);
  };

  const inputStyle = {
    marginBottom: "0.75rem",
    padding: "0.5rem",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    background: "#fff",
    color: "#000",
  };

  const labelStyle = {
    fontWeight: "bold",
    marginBottom: "0.25rem",
    display: "block",
    color: "#fff",
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      overflow: "auto",
      padding: "1rem"
    }}>
      <form onSubmit={handleSubmit} style={{ background: "#222", padding: "1.5rem", borderRadius: "10px", width: "100%", maxWidth: "600px", color: "#fff" }}>
        <h3 style={{ marginBottom: "1rem", color: "#fff" }}>新增作物</h3>

        <label style={labelStyle}>名稱：</label>
        <input name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />

        <label style={labelStyle}>分類：</label>
        <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
          <option value="蔬菜">蔬菜</option>
          <option value="水果">水果</option>
          <option value="花卉">花卉</option>
          <option value="藥草">藥草</option>
        </select>

        <label style={labelStyle}>種植日期：</label>
        <DatePicker
          selected={formData.planting_date}
          onChange={(date) => setFormData({ ...formData, planting_date: date })}
          dateFormat="yyyy/MM/dd"
          placeholderText="請選擇日期"
          style={inputStyle}
        />

        <label style={labelStyle}>預計收成日：</label>
        <DatePicker
          selected={formData.harvest_date}
          onChange={(date) => setFormData({ ...formData, harvest_date: date })}
          dateFormat="yyyy/MM/dd"
          placeholderText="請選擇日期"
          style={inputStyle}
        />

        <label style={labelStyle}>實際收成日：</label>
        <DatePicker
          selected={formData.actual_harvest_date}
          onChange={(date) => setFormData({ ...formData, actual_harvest_date: date })}
          dateFormat="yyyy/MM/dd"
          placeholderText="請選擇日期"
          style={inputStyle}
        />

        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>產量：</label>
            <input name="yield_" value={formData.yield_} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ flex: 1 }}>
            <label style={labelStyle}>區域：</label>
            <select name="area" value={formData.area} onChange={handleChange} style={inputStyle}>
              <option value="A區">A區</option>
              <option value="B區">B區</option>
              <option value="C區">C區</option>
            </select>
          </div>
        </div>

        <label style={labelStyle}>苗來源：</label>
        <select name="origin" value={formData.origin} onChange={handleChange} style={inputStyle}>
          <option value="市場買的苗">市場買的苗</option>
          <option value="自家育苗">自家育苗</option>
          <option value="朋友給的">朋友給的</option>
        </select>

        <label style={labelStyle}>備註：</label>
        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} style={{ ...inputStyle, resize: "vertical" }} />

        <label style={labelStyle}>上傳圖片：</label>
        <input type="file" multiple onChange={handleFileChange} style={inputStyle} accept="image/*" />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {previewUrls.map((url, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <img src={url} alt={`preview-${idx}`} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px" }} />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              >×</button>
            </div>
          ))}
        </div>

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
          <button type="button" onClick={onClose} style={{ padding: "0.5rem 1rem" }}>取消</button>
          <button type="submit" disabled={loading} style={{ padding: "0.5rem 1rem" }}>{loading ? "送出中..." : "送出"}</button>
        </div>
      </form>
    </div>
  );
}

export default CreateCropForm;
