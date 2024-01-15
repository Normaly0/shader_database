uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec4 vNormal;
varying vec3 vModelPosition;

varying vec3 vColor1;
varying vec3 vColor2;

void main() {

    //Position

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    //Varyings

    vNormal = normalize(modelMatrix * vec4(normal, 0.0));
    vModelPosition = vec3(modelMatrix * vec4(position, 1.0));

    vColor1 = uColor1;
    vColor2 = uColor2;
}