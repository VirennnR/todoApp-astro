import type { APIRoute } from "astro";
import { todoDb } from "../../db";

export const prerender = false;

// Create
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    const result = await todoDb.create({
      title,
      description,
      created_at: new Date().toISOString(),
      completed: false,
    });

    return new Response(
      JSON.stringify({
        success: true,
        id: result,
        title: title,
        description: description,
        createdAt: new Date().toISOString(),
        completed: false,
      }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

// Get All
export const GET: APIRoute = async () => {
  try {
    const todos = await todoDb.getAll();
    return new Response(JSON.stringify({ todos }), {
      status: 200,
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
