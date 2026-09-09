import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Domain name is required' }, { status: 400 });
  }

  // Clean input URL to pure hostname
  try {
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = 'http://' + domain;
    }
    const parsedUrl = new URL(domain);
    domain = parsedUrl.hostname;
  } catch {
    return NextResponse.json({ error: 'Invalid domain name or URL format' }, { status: 400 });
  }

  try {
    // 1. Resolve DNS to IP using Google Public DNS-over-HTTPS API
    const dnsRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`, {
      headers: { Accept: 'application/json' },
    });
    const dnsData = await dnsRes.json();

    if (!dnsData.Answer || dnsData.Answer.length === 0) {
      return NextResponse.json({ error: `Could not resolve IP address for domain "${domain}".` }, { status: 404 });
    }

    // Filter A record (type 1)
    const aRecord = dnsData.Answer.find((record: any) => record.type === 1) || dnsData.Answer[0];
    const ipAddress = aRecord.data;

    // 2. Fetch IP Geolocation details via ip-api.com
    const geoRes = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
    const geoData = await geoRes.json();

    return NextResponse.json({
      domain,
      ip: ipAddress,
      geo: geoData.status === 'success' ? geoData : null,
      allRecords: dnsData.Answer.map((a: any) => ({ name: a.name, type: a.type, data: a.data, ttl: a.TTL })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to check IP: ' + (err.message || 'Server error') }, { status: 500 });
  }
}