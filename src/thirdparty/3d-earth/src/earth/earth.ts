/*
 * @Author: ZY
 * @Date: 2021-12-31 11:19:58
 * @LastEditors: ZY
 * @LastEditTime: 2021-12-31 14:29:31
 * @FilePath: /3d-earth/lib/src/earth/earth.ts
 * @Description: 地球模型
 */

import {
  TextureLoader,
  SphereGeometry,
  // MeshLambertMaterial,
  Mesh,
  MeshBasicMaterial,
} from "three";
// import earthTexture from "../img/earth.png";
// import EarthDayMap from "../img/8k_earth_daymap.jpg";
import EarthNightMap from "../img/8k_earth_nightmap.jpg";
// import EarthNormalMap from "../img/8k_earth_normal_map.jpg";
import EarthSpecularMap from "../img/8k_earth_specular_map.jpg";
// import EarthCloudsMap from "../img/8k_earth_clouds.jpg";

//添加地球贴图的Mesh到场景中
export const createEarthImageMesh = (radius: number) => {
  // TextureLoader创建一个纹理加载器对象，可以加载图片作为纹理贴图
  var textureLoader = new TextureLoader();
  //加载纹理贴图
  // var texture = textureLoader.load(earthTexture);
  //创建一个球体几何对象
  var geometry = new SphereGeometry(radius, 96, 96);
  //材质对象Material
  // MeshLambertMaterial  MeshBasicMaterial
  var material = new MeshBasicMaterial({
    // map: textureLoader.load(EarthNightMap), //设置地球0颜色贴图map
    map: textureLoader.load(EarthSpecularMap),
    // aoMapIntensity: 10,
    // aoMap: textureLoader.load(EarthSpecularMap),
    // specularMap: textureLoader.load(EarthSpecularMap),
    lightMap: textureLoader.load(EarthNightMap),
  });
  var mesh = new Mesh(geometry, material); //网格模型对象Mesh
  return mesh;
};
