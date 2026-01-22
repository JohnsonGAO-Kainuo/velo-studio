#!/usr/bin/env python3
"""修复图标 - 裁剪内容并居中放置在正方形画布上"""

from PIL import Image
import numpy as np
import os
import subprocess
import shutil

base_path = "/Users/johnson/Desktop/开发/Web/Velo Studio/icons/icons"

# 打开原始图标
print("正在打开图标...")
img = Image.open(f"{base_path}/png/1024x1024.png")
img = img.convert('RGBA')
arr = np.array(img)

# 找出非透明区域的边界
non_transparent = np.where(arr[:, :, 3] > 0)
top = non_transparent[0].min()
bottom = non_transparent[0].max()
left = non_transparent[1].min()
right = non_transparent[1].max()

print(f"原始内容区域: 顶部={top}, 底部={bottom}, 左={left}, 右={right}")
print(f"内容尺寸: {right - left + 1} x {bottom - top + 1}")

# 裁剪出内容区域
content = img.crop((left, top, right + 1, bottom + 1))
content_width, content_height = content.size
print(f"裁剪后尺寸: {content_width} x {content_height}")

# 计算需要的正方形尺寸（取较大的边）
square_size = max(content_width, content_height)
# 添加一些边距 (10%)
padding = int(square_size * 0.1)
final_size = square_size + padding * 2

print(f"目标正方形尺寸: {final_size} x {final_size}")

# 创建透明的正方形画布
new_img = Image.new('RGBA', (final_size, final_size), (0, 0, 0, 0))

# 将内容居中放置
x_offset = (final_size - content_width) // 2
y_offset = (final_size - content_height) // 2
new_img.paste(content, (x_offset, y_offset))

# 缩放到 1024x1024
final_img = new_img.resize((1024, 1024), Image.Resampling.LANCZOS)

# 保存
final_img.save(f"{base_path}/png/1024x1024.png")
print("已保存修复后的 1024x1024.png")

# 生成其他尺寸
sizes = [512, 256, 128, 64, 48, 32, 24, 16]
for size in sizes:
    resized = final_img.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(f"{base_path}/png/{size}x{size}.png")
    print(f"已生成 {size}x{size}.png")

print("\n正在生成 .icns 文件...")
iconset_path = f"{base_path}/mac/icon.iconset"
os.makedirs(iconset_path, exist_ok=True)

iconset_sizes = [
    (16, "icon_16x16.png"),
    (32, "icon_16x16@2x.png"),
    (32, "icon_32x32.png"),
    (64, "icon_32x32@2x.png"),
    (128, "icon_128x128.png"),
    (256, "icon_128x128@2x.png"),
    (256, "icon_256x256.png"),
    (512, "icon_256x256@2x.png"),
    (512, "icon_512x512.png"),
    (1024, "icon_512x512@2x.png"),
]

for size, filename in iconset_sizes:
    resized = final_img.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(f"{iconset_path}/{filename}")

result = subprocess.run(
    ["iconutil", "-c", "icns", iconset_path, "-o", f"{base_path}/mac/icon.icns"],
    capture_output=True, text=True
)

if result.returncode == 0:
    print("✅ 成功生成 icon.icns")
    shutil.rmtree(iconset_path)
else:
    print(f"❌ 失败: {result.stderr}")

print("\n🎉 图标修复完成！")
