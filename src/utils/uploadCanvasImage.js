export const compressImage = (
  file,
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.8
) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result

      img.onload = () => {
        let width = img.width
        let height = img.height

        // 根据最大宽度和高度调整图片尺寸
        if (width > maxWidth) {
          height = height * (maxWidth / width)
          width = maxWidth
        }

        if (height > maxHeight) {
          width = width * (maxHeight / height)
          height = maxHeight
        }

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = width
        canvas.height = height

        // 将图片绘制到 canvas 上
        ctx.drawImage(img, 0, 0, width, height)

        // 将 canvas 转换为 Blob 对象
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('无法生成压缩后的 Blob 对象'))
            }
          },
          file.type,
          quality
        )
      }

      img.onerror = () => {
        reject(new Error('图片加载失败'))
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
  })
}
