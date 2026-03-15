import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("proposals")
      .insert({
        company_name: body.company_name,
        industry: body.industry || null,
        employee_count: body.employee_count,
        shamel_individual_count: body.shamel_individual_count || 0,
        shamel_family_count: body.shamel_family_count || 0,
        mini_individual_count: body.mini_individual_count || 0,
        mini_family_count: body.mini_family_count || 0,
        tier_type: body.tier_type || null,
        shamel_subtotal: body.shamel_subtotal || 0,
        mini_subtotal: body.mini_subtotal || 0,
        total_annual: body.total_annual,
        lump_sum_discount: body.lump_sum_discount || 0,
        final_total: body.final_total,
        sales_name: body.sales_name || null,
        sales_title: body.sales_title || null,
        recipient_name: body.recipient_name || null,
        recipient_title: body.recipient_title || null,
        quotation_date: body.quotation_date || null,
        language: body.language || null,
        payment_terms: body.payment_terms || null,
        offer_validity: body.offer_validity || null,
        notes: body.notes || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (err) {
    console.error("Proposal save error:", err);
    return NextResponse.json({ error: "Failed to save proposal" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Validate password
    const password = request.headers.get("x-dashboard-password");
    if (!password || password !== process.env.DASHBOARD_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    let query = supabase
      .from("proposals")
      .select("*")
      .order("created_at", { ascending: false });

    if (search.trim()) {
      query = query.ilike("company_name", `%${search.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ proposals: data });
  } catch (err) {
    console.error("Proposals fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 });
  }
}
