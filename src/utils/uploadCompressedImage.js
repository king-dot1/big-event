import Compressor from 'compressorjs'

// 定义函数 压缩图片并转换成 base64 编码
export const uploadCompressedImage = (file) => {
  // 返回一个 promise 对象，用于异步处理
  return new Promise((resolve, reject) => {
    // 使用 Compressor 库进行图片压缩
    new Compressor(file, {
      // 压缩质量，范围 0 - 1，值越小压缩率越高
      // 这里设置为 0.6，表示压缩到原质量的 60%
      quality: 0.6,
      // 压缩成功时的回调函数
      success(result) {
        // 创建一个 FileReader 对象，用于读取文件内容
        const reader = new FileReader()
        // 开始读取压缩后的文件，并转成 Data URL （Base64 编码）
        reader.readAsDataURL(result)
        // 当读取完成时的回调函数
        reader.onload = () => {
          // 获取读取的结果，即 Base64 字符串
          const base64String = reader.result
          // 这里可以发起上传请求，比如使用 fetch 或 axios
          // 示例中只是简单返回 base64 字符串
          resolve(base64String)
        }
        // 读取文件失败时的回调函数
        reader.onerror = (error) => {
          // 如果读取失败，拒接 promise 并传递错误信息
          reject(error)
        }
      },
      // 压缩失败时的回调函数
      error(err) {
        reject(err)
      }
    })
  })
}
