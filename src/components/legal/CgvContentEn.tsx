function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function CgvContentEn() {
  return (
    <>
      <Section title="1 — Scope and acceptance">
        <p>
          These Terms of Service govern the contractual relationship between
          Niche Founder (&quot;the Provider&quot;) and any individual or entity
          subscribing to services on nichefounder.com (&quot;the Customer&quot;).
        </p>
        <p>
          Niche Founder is an online SaaS market analysis service. Any subscription
          implies full acceptance of these Terms.
        </p>
      </Section>

      <Section title="2 — Provider identity">
        <p>
          <strong className="text-white">Niche Founder</strong> — Sole proprietor, France
          <br />
          Email:{" "}
          <a href="mailto:contact@nichefounder.com" className="text-accent-blue hover:underline">
            contact@nichefounder.com
          </a>
        </p>
      </Section>

      <Section title="3 — Services and pricing">
        <p>
          Niche Founder offers a single <strong className="text-white">Pro plan (€29/month)</strong>{" "}
          with full access to all features:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Unlimited analysis reports</li>
          <li>Full competitive analysis</li>
          <li>ARR/MRR estimates and advanced market signals</li>
          <li>Market size data</li>
          <li>PDF export</li>
        </ul>
        <p>
          Reports are provided for informational purposes only. Data is based on public
          sources and algorithmic estimates without guarantee of accuracy.
        </p>
      </Section>

      <Section title="4 — Payment and subscription">
        <p>
          Pro subscriptions are billed monthly via Stripe. Subscriptions auto-renew unless
          cancelled before the renewal date. Failed payments may result in service suspension.
        </p>
      </Section>

      <Section title="5 — Cancellation">
        <p>
          Customers may cancel at any time from their account or by emailing{" "}
          <a href="mailto:contact@nichefounder.com" className="text-accent-blue hover:underline">
            contact@nichefounder.com
          </a>
          . Cancellation takes effect at the end of the current billing period.
        </p>
      </Section>

      <Section title="6 — Customer obligations">
        <p>
          Customers must not share credentials, scrape data at scale, or resell reports
          without written authorization.
        </p>
      </Section>

      <Section title="7 — Liability">
        <p>
          Provider liability is limited to amounts paid by the Customer in the preceding
          12 months. Reports are decision-support tools, not financial advice.
        </p>
      </Section>

      <Section title="8 — Personal data">
        <p>
          Personal data is processed in accordance with GDPR. Contact{" "}
          <a href="mailto:contact@nichefounder.com" className="text-accent-blue hover:underline">
            contact@nichefounder.com
          </a>{" "}
          for any request.
        </p>
      </Section>

      <Section title="9 — Governing law">
        <p>These Terms are governed by French law. Disputes shall be submitted to competent French courts.</p>
      </Section>
    </>
  );
}
