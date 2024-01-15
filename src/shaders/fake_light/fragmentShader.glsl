varying vec4 vNormal;

varying vec3 vColor1;
varying vec3 vColor2;

void main() {
    float strength = clamp(dot(vNormal.xzy, vec3(-1.0, 0.5, 1.0)), 0.0, 1.0);
    vec3 mixedColor = mix(vColor1, vColor2, strength);

    gl_FragColor = vec4(mixedColor, 1.0);

    #include <colorspace_fragment>
}