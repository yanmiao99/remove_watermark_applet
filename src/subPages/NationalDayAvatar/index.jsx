import { View, Image, ScrollView, Canvas } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";
import { Button } from "@nutui/nutui-react-taro";
import avatartemplate from "./avatar.json";
import "./index.less";

export default function NationalDayAvatar() {
  const bgImg = require("./static/bg.png");
  const bgTextImg = require("./static/bg-text.png");
  const defaultAvatar = require("./static/default_avatar.png");

  const [uploadAvatar, setUploadAvatar] = useState("");
  const [isDefaultAvatar, setIsDefaultAvatar] = useState(true);
  const [compositeAvatar, setCompositeAvatar] = useState("");
  const [currentSelectedIndex, setCurrentSelectedIndex] = useState(-1);
  const [canvasStyle, setCanvasStyle] = useState({ width: "500px", height: "500px" });

  function handleAvatarUpload() {
    Taro.chooseMedia({
      count: 1,
      mediaType: ["image"],
      success: (res) => {
        if (res.errMsg === "chooseMedia:ok") {
          const file = res.tempFiles[0];
          setIsDefaultAvatar(false);
          setUploadAvatar(file.tempFilePath);
          setCompositeAvatar(file.tempFilePath);
        }
      },
    });
  }

  function handleAvatarTemplateSelect(index) {
    if (index === currentSelectedIndex) return;

    if (isDefaultAvatar || !uploadAvatar) {
      Taro.showToast({
        title: "请先上传头像图片",
        icon: "none",
      });
      return;
    }
    setCurrentSelectedIndex(index);
    drawAvatar(avatartemplate[index]);
  }

  async function drawAvatar(imgUrl) {
    try {
      const ctx = wx.createCanvasContext("avatarCanvas");
      const { path, width, height } = await Taro.getImageInfo({ src: imgUrl });
      setCanvasStyle({
        width: `${width}px`,
        height: `${height}px`,
      });
      ctx.drawImage(uploadAvatar, 0, 0, width, height);
      ctx.drawImage(path, 0, 0, width, height);
      ctx.draw(true, async () => {
        const { tempFilePath } = await Taro.canvasToTempFilePath({
          width,
          height,
          canvasId: "avatarCanvas",
          x: 0,
          y: 0,
        });
        setCompositeAvatar(tempFilePath);
      });
    } catch (error) {
      console.error("生成头像失败", error);
    }
  }

  async function handleSaveAvatar() {
    if (!uploadAvatar || isDefaultAvatar) {
      Taro.showToast({ title: "请上传并选择需要生成的头像图片", icon: "none" });
    } else if (!currentSelectedIndex < 0) {
      Taro.showToast({ title: "请选择一个头像模板", icon: "none" });
    } else {
      Taro.saveImageToPhotosAlbum({
        filePath: compositeAvatar,
        success: () => {
          Taro.showToast({
            title: "保存成功",
          });
        },
      });
    }
  }
  return (
    <View class="national_day_avatar">
      <Image class="national_day_avatar__bg" src={bgImg} />
      <View className="national_day_avatar__container">
        <Image class="national_day_avatar__title" src={bgTextImg} />

        <View className="national_day_avatar__preview is-default" onClick={() => handleAvatarUpload()}>
          <Image class="national_day_avatar__preview-img" src={isDefaultAvatar ? defaultAvatar : compositeAvatar} />
        </View>

        <ScrollView scrollX={true} className="national_day_avatar__preview-scroll">
          <View className="national_day_avatar__preview-template">
            {avatartemplate.map((item, index) => (
              <Image
                key={item}
                className={`national_day_avatar__preview-template-item ${currentSelectedIndex === index && "is-selected"}`}
                src={item}
                onClick={() => handleAvatarTemplateSelect(index)}
              />
            ))}
          </View>
        </ScrollView>

        <Button size="xlarge" block color="#fff" onClick={handleSaveAvatar}>
          保存头像
        </Button>

        <Canvas canvasId="avatarCanvas" id="avatarCanvas" className="national_day_avatar__preview-canvas" style={canvasStyle}></Canvas>
      </View>
    </View>
  );
}
