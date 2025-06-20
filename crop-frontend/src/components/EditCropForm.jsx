import { useState, useEffect } from "react";
import CreateCropForm from "./CreateCropForm";
import EditCropForm from "./EditCropForm";

function CropList() {
  const [crops, setCrops] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  const fetchCrops = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/crops");
      const data = await res.json();
      setCrops(data);
    } catch (error) {
      console.error("無法取得作物資料", error);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleEdit = (crop) => {
    setSelectedCrop(crop);
    setShowEditModal(true);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>作物列表</h2>
      <button onClick={() => setShowCreateModal(true)} style={{ marginBottom: "1rem" }}>＋ 新增作物</button>
      <ul>
        {crops.map((crop) => (
          <li key={crop.id} style={{ marginBottom: "0.5rem" }}>
            {crop.name} ({crop.category})
            <button onClick={() => handleEdit(crop)} style={{ marginLeft: "1rem" }}>✏ 編輯</button>
          </li>
        ))}
      </ul>

      {showCreateModal && (
        <CreateCropForm
          onClose={() => setShowCreateModal(false)}
          onCropCreated={fetchCrops}
        />
      )}

      {showEditModal && selectedCrop && (
        <EditCropForm
          crop={selectedCrop}
          onClose={() => setShowEditModal(false)}
          onUpdated={fetchCrops}
        />
      )}
    </div>
  );
}

export default CropList;
