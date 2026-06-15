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
          NicheSignal (&quot;the Provider&quot;) and any individual or entity
          subscribing to services on nichesignal.com (&quot;the Customer&quot;).
        </p>
        <p>
          NicheSignal is an online SaaS market analysis service. Any subscription
          implies full acceptance of these Terms.
        </p>
      </Section>

      <Section title="2 — Provider identity">
        <p>
          <strong className="text-white">NicheSignal</strong> — Sole proprietor, France
          <br />
          Email:{" "}
          <a href="mailto:contact@nichesignal.com" className="text-accent-blue hover:underline">
            contact@nichesignal.com
          </a>
        </p>
      </Section>

      <Section title="3 — Services and pricing">
        <p>
          <strong className="text-white">Free plan:</strong> 2 reports/day, basic competitor
          data, opportunity score.
        </p>
        <p>
          <strong className="text-white">Pro plan (€29/month):</strong> unlimited reports,
          full competitor analysis, ARR/MRR estimates, market size data, PDF export.
        </p>
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
          <a href="mailto:contact@nichesignal.com" className="text-accent-blue hover:underline">
            contact@nichesignal.com
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
          <a href="mailto:contact@nichesignal.com" className="text-accent-blue hover:underline">
            contact@nichesignal.com
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
