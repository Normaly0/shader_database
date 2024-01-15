varying vec3 vModelPosition;
varying vec4 vNormal;

varying vec3 vColor1;
varying vec3 vColor2;

float circle(vec3 point, float radius) {

    vec2 grid = fract(gl_FragCoord.xy / 500.0 * 15.0);
    float circle = 1.0 - distance(grid, vec2(0.5));
    circle -= radius;
    circle = clamp(circle, 0.0, 1.0);
    circle = step(0.2, circle);
    
    return circle;
}

void main() {
    float angle = clamp(dot(vNormal.xyz, vec3(-1.0, 1.0, 1.0)), 0.0, 1.0);
    float pattern = circle(vModelPosition.xzy, 1.0 - angle);

    vec3 Color1 = vec3(0.02, 0.27, 0.83);
    vec3 Color2 = vec3(0.14, 0.56, 0.89);
    vec3 mixedColor = mix(Color1, Color2, pattern);

    gl_FragColor = vec4(mixedColor, 1.0);

    #include <colorspace_fragment>;
}