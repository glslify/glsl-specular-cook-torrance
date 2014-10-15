#pragma glslify: beckmannSpecular = require(glsl-specular-beckmann)

float cookTorranceSpecular(
  vec3 lightDirection,
  vec3 viewDirection,
  vec3 surfaceNormal,
  float roughness,
  float fresnel) {

  float VdotN = dot(viewDirection, surfaceNormal);
  float LdotN = dot(lightDirection, surfaceNormal);

  //Half angle vector
  vec3 H = normalize(lightDirection + viewDirection);

  //Distribution term
  float D = beckmannSpecular(
    lightDirection, 
    viewDirection, 
    surfaceNormal, 
    roughness);

  //Geometric term
  float NdotH = dot(surfaceNormal, H);
  float VdotH = dot(viewDirection, H);
  float w = 2.0 * NdotH / VdotH;
  float G = min(1.0, min(w*VdotN, w*LdotN));

  //Fresnel term
  float F = pow(1.0 + VdotN, fresnel);

  //Multiply terms and done
  return D * F * G / (3.14159265 * VdotN * LdotN);
}

#pragma glslify: export(cookTorranceSpecular)