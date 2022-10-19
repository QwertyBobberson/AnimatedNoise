#include "Application.cpp"
#include <typeinfo>
using namespace std;


void DrawSquare(double x, double y, double z, double width, double height, double r, double g, double b)
{
	int start = verts.size();
	verts.push_back({{x			, y			, z}, {r, g, b}});
	verts.push_back({{x + width	, y			, z}, {r, g, b}});
	verts.push_back({{x			, y + height, z}, {r, g, b}});
	verts.push_back({{x + width	, y + height, z}, {r, g, b}});

	indices.push_back(start + 0);
	indices.push_back(start + 1);
	indices.push_back(start + 2);
	indices.push_back(start + 3);
	indices.push_back(start + 2);
	indices.push_back(start + 1);
}

void DrawSquareFacingCamera(double x, double y, double width, double height, double r, double g, double b)
{
	if(width < 0)
	{
		x += width;
		width *= -1;
	}
	if(height < 0)
	{
		y += height;
		height *= -1;
	}

	DrawSquare(x, y, 0, width, height, r, g, b);
}

int main(int argc, char** argv)
{
	Application app;

	// DrawSquare(-0.5, -0.5, 1, 1, 0, 0, 1);

	// PNG png = ReadPng("test2.png");

	// std::cout << png.height << " " << png.width << std::endl;

	int sHeight = HEIGHT;
	int sWidth = WIDTH;

	// DrawSquare(-0.5, -0.5, 0, 1, 1, 0, 0, 0);
	DrawSquareFacingCamera(-1, -1, 2, 2, 0, 0, 1);

	// for(int y = -sHeight; y < sHeight; y++)
	// {
	// 	for(int x = -sWidth; x < sWidth; x++)
	// 	{
	// 		int xIndex = x == -sWidth ? 0 : floor((double)png.width/((x + sWidth)/2.0)) * 4;
	// 		int yIndex = y == -sHeight ? 0 : floor((double)png.height/((y + sHeight)/2.0));
	// 		std::cout << x << " " << y << std::endl;
	// 		std::cout << xIndex << " " << yIndex << std::endl;
	// 		double r = (png.pRows[yIndex][xIndex + 0])/255.0;
	// 		double g = (png.pRows[yIndex][xIndex + 1])/255.0;
	// 		double b = (png.pRows[yIndex][xIndex + 2])/255.0;

	// 		// double xPos = (double)x/png.width;
	// 		// std::cout << y << " " << xPos << " " << x << std::endl;

	// 		// double yPos = (double)y/png.height;
	// 		// std::cout << y << " " << yPos << " " << x << std::endl;

	// 		// double pWidth = 1.0/png.width;
	// 		// std::cout << y << " " << pWidth << " " << x << std::endl;

	// 		// double pHeight = 1.0/png.height;
	// 		// std::cout << y << " " << pHeight << " " << x << std::endl;

	// 		// if(r != 0 || g != 0 || b != 0)
	// 		// {
	// 		// 	std::cout << y << " " << r << " " << x << std::endl;
	// 		// 	std::cout << y << " " << g << " " << x << std::endl;
	// 		// 	std::cout << y << " " << b << " " << x << std::endl;
	// 		// }

	// 		// std::cout << ((double)x/WIDTH) << std::endl;
	// 		DrawSquare(((double)x/WIDTH), ((double)y/HEIGHT), 1.0/WIDTH, 1.0/HEIGHT, r, g, b);
	// 	}
	// }

	// std::cout << (int)png.colorType << std::endl;
	//   << png.pRows[png.height - 1][png.rows - 1][3] << ", ";

	// verts.resize(10);
	// indices.resize(10);
	
	// std::cout << "Validation Layers: " << enableValidationLayers<< std::endl;
	
	// PNG png = ReadPng("test.png");
	
	
	// verts = 
	// {
	// 	{{-0.5f, -0.5f}, {1.0f, 0.0f, 0.0f}, {1.0f, 0.0f}},
	// 	{{ 0.5f, -0.5f}, {0.0f, 1.0f, 0.0f}, {0.0f, 0.0f}},
	// 	{{ 0.5f,  0.5f}, {0.0f, 0.0f, 1.0f}, {0.0f, 1.0f}},
	// 	{{-0.5f,  0.5f}, {0.0f, 0.0f, 0.0f}, {1.0f, 1.0f}}
	// };

	// indices = 
	// {
	// 	0, 1, 2, 
	// 	2, 3, 0
	// };

	// DrawSquare(-0.5, -0.5, -0.5, 1, 1, 0, 0, 1);
	// // DrawSquare(-0.5, -0.5, 0, 1, 1, 0, 0, 1);
	// DrawSquare(-0.5, -0.5, 0.5, 1, 1, 0, 0, 1);
	// DrawSquare(-0.5, -0.5, 1, 1, 1, 0, 0, 1);

	// double size = std::stod(argv[1]);
	// for(int y = -size; y < size; y += 1)
	// {
	// 	for(int x = -size; x < size; x += 1)
	// 	{
	// 		if((x + y) % 2 == 0)
	// 		{
	// 			DrawSquare(x/size, y/size, 1/size, 1/size, 0, 0.05, 0.95);
	// 		}
	// 		else
	// 		{
	// 			DrawSquare(x/size, y/size, 1/size, 1/size, 0.005, 0.005, 0.005);
	// 		}
	// 	}
	// }
	try
	{
		app.Run(verts, indices);
	}
	catch(const std::exception& e)
	{
		std::cerr << e.what() << '\n';
		return EXIT_FAILURE;
	}

	return EXIT_SUCCESS;
	
}