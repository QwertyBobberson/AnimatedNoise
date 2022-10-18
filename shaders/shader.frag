#version 450

layout(location = 0) in vec3 fragColor;
layout(location = 0) out vec4 outColor;

layout(binding = 0) uniform UniformBufferObject
{
    float z;
} ubo;


int octaves = 25;
float scale = 500;
float lacunarity = 2;
float persistence = .5f;
float offsetNoiseWeight = 10000;
float offsetNoiseScale = 1000;
float xOffset = 100;
float yOffset = 100;

vec3 GenerateVector(int x, int y, int z)
{
    float j = 4096.0*sin(dot(vec3(x, y, z),vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
    r -= 0.5;
    r = normalize(r);
	return r;
}

float SmoothStep(float x, float min, float max)
{
    return ((x * x * x * (x * (x * 6 - 15) + 10)) * (max-min)) + min;
}


float GetPoint(float x, float y, float z)
{
    float dotProducts[2][2][2];
    vec3 distance = vec3(x - floor(x), y - floor(y), z - floor(z));
    vec3 offset;
    vec3 gradient;
    float dotProduct;

    for(int _z = 0; _z < 2; _z++)
    {
        for(int _y = 0; _y < 2; _y++)
        {
            for(int _x = 0; _x < 2; _x++)
            {
                offset.x = _x - distance.x;
                offset.y = _y - distance.y;
                offset.z = _z - distance.z;

                gradient = GenerateVector(int(x + offset.x), int(y + offset.y), int(z + offset.z));
                
                dotProducts[_z][_y][_x] = dot(offset, gradient);
            }
        }
    }



    float xy1z1 = SmoothStep(distance.z, dotProducts[0][0][0], dotProducts[1][0][0]);
    float xy2z1 = SmoothStep(distance.z, dotProducts[0][1][0], dotProducts[1][1][0]);
    float xy1z2 = SmoothStep(distance.z, dotProducts[0][0][1], dotProducts[1][0][1]);
    float xy2z2 = SmoothStep(distance.z, dotProducts[0][1][1], dotProducts[1][1][1]);
    float xyz1 = SmoothStep(distance.y, xy1z1, xy2z1);
    float xyz2 = SmoothStep(distance.y, xy1z2, xy2z2);
    float xyz = SmoothStep(distance.x, xyz1, xyz2);


    return xyz;

}
void main()
{
    float amplitude = 2;
    float frequency = 1;
    float noiseValue = 0;
    float zFreq = .25;

    float offsetNoise = offsetNoiseWeight * GetPoint(gl_FragCoord.x/offsetNoiseScale, gl_FragCoord.y/offsetNoiseScale, ubo.z * zFreq);
    for(int i = 0; i < octaves; i++)
    {
        noiseValue += GetPoint((gl_FragCoord.x + xOffset + offsetNoise)/scale * frequency, (gl_FragCoord.y + yOffset + offsetNoise)/scale * frequency, ubo.z * zFreq) * amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }
    outColor = vec4(0, 0, noiseValue * noiseValue * noiseValue, 1.0);
}