import React, { useState, useRef } from 'react'

export default function ScreenshotUploader({ battleGoal, onScreenshotsSelected }) {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      f => f.type.startsWith('image/')
    )
    handleFiles(droppedFiles)
  }

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    handleFiles(selectedFiles)
  }

  const handleFiles = (newFiles) => {
    const updatedFiles = [...files, ...newFiles].slice(0, 40)
    setFiles(updatedFiles)
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (files.length > 0) {
      onScreenshotsSelected(files)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Upload Pokemon Screenshots</h2>
        <p className="text-gray-400">
          From Poke Genie, Pokemon GO app, or any other source.
          <br />
          <strong className="text-yellow-500">📸 Recommended: 20-40 screenshots</strong>
        </p>
      </div>

      <div
        className={`rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200 ${
          dragActive
            ? 'border-red-500 bg-red-500/10'
            : 'border-gray-600 bg-gray-900/50 hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-5xl mb-4">📸</div>
        <h3 className="text-xl font-bold mb-2">Drag and drop screenshots here</h3>
        <p className="text-gray-400 mb-6">Or click the button below</p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 font-bold transition-colors"
        >
          Select Files
        </button>

        <p className="text-xs text-gray-500 mt-4">PNG, JPG, or WebP • Up to 40 files</p>
      </div>

      {files.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">
              Selected: <span className="text-red-500">{files.length}</span>
            </h3>
            {files.length > 0 && (
              <button
                onClick={() => setFiles([])}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-6 gap-3">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-700"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                >
                  <span className="text-white text-xl">✕</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={handleSubmit}
          disabled={files.length === 0}
          className="w-full py-4 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed font-bold text-lg transition-all"
        >
          {files.length === 0 
            ? 'Upload screenshots to continue' 
            : `Analyze ${files.length} screenshot${files.length !== 1 ? 's' : ''}`
          }
        </button>
      </div>
    </div>
  )
}
