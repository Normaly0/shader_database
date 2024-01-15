varying vec3 vModelPosition;
varying vec4 vNormal;
varying vec3 vCameraPosition;

varying vec3 vColor1;
varying vec3 vColor2;

void main() {

    vec3 viewDirection = normalize(cameraPosition - vModelPosition);
    float fresnel = dot(viewDirection, vNormal.xyz);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = smoothstep(0.4, 1.0, fresnel);

    vec3 colorEmissive = vec3(2.2, 0.5, 0.0);
    vec3 colorBase = vec3(1.00, 0.72, 0.28);
    vec3 colorMix = mix(colorBase, colorEmissive, fresnel);

    gl_FragColor = vec4(colorMix, clamp(fresnel, 0.2, 1.0));

    #include <colorspace_fragment>

}