#version 450
#extension GL_EXT_debug_printf : enable

layout(location = 0) in vec3 fragColor;
layout(location = 0) out vec4 outColor;

layout(binding = 0) uniform UniformBufferObject
{
    float z;
    int octaves;
    float scale;
    float lacunarity;
    float persistence;
    float offsetNoiseWeight;
    float amplitude;
    float frequency;
    float zFreq;
    float pow;
} ubo;



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

#define PrintVar(var) debugPrintfEXT(" is %f\n", var)
void main()
{

    float noiseValue = 0;
    float amplitude = ubo.amplitude;
    float frequency = ubo.frequency;

    float offsetNoise = ubo.offsetNoiseWeight != 0 ? ubo.offsetNoiseWeight * GetPoint(gl_FragCoord.x/(ubo.offsetNoiseWeight/10), gl_FragCoord.y/(ubo.offsetNoiseWeight/10), ubo.z * ubo.zFreq) : 0;

    for(int i = 0; i < ubo.octaves; i++)
    {
        amplitude *= ubo.persistence;
        noiseValue += GetPoint((gl_FragCoord.x + offsetNoise)/ubo.scale * frequency, (gl_FragCoord.y + offsetNoise)/ubo.scale * frequency, ubo.z * ubo.zFreq) * amplitude;
        frequency *= ubo.lacunarity;
    }

    outColor = vec4(0, 0, pow(noiseValue, ubo.pow), 1.0);
}