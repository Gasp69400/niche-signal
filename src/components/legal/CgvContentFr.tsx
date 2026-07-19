function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function CgvContentFr() {
  return (
    <>
      <Section title="Article 1 — Objet et champ d'application">
        <p>
          Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent
          les relations contractuelles entre Niche Founder (ci-après « le Prestataire »)
          et toute personne physique ou morale souscrivant aux services proposés sur
          le site nichefounder.com (ci-après « le Client »).
        </p>
        <p>
          Niche Founder est un service en ligne (SaaS) d&apos;analyse de marché permettant
          d&apos;identifier des niches SaaS, d&apos;analyser les pain points utilisateurs,
          les concurrents et d&apos;obtenir un score d&apos;opportunité.
        </p>
        <p>
          Toute commande ou souscription implique l&apos;acceptation sans réserve des
          présentes CGV, qui prévalent sur tout autre document, sauf conditions
          particulières expressément acceptées par écrit par le Prestataire.
        </p>
      </Section>

      <Section title="Article 2 — Identité du Prestataire">
        <p>
          <strong className="text-white">Raison sociale :</strong> Niche Founder
          <br />
          <strong className="text-white">Forme juridique :</strong> Entrepreneur individuel
          <br />
          <strong className="text-white">Siège social :</strong> France
          <br />
          <strong className="text-white">Email :</strong>{" "}
          <a href="mailto:contact@nichefounder.com" className="text-accent-blue hover:underline">
            contact@nichefounder.com
          </a>
          <br />
          <strong className="text-white">Directeur de la publication :</strong> Le fondateur de Niche Founder
        </p>
      </Section>

      <Section title="Article 3 — Description des services">
        <p>
          Niche Founder propose une formule <strong className="text-white">Pro (9,90 € TTC / mois)</strong>{" "}
          donnant accès à l&apos;ensemble des fonctionnalités :
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Jusqu&apos;à 80 rapports d&apos;analyse par mois (quota renouvelé le 1er de chaque mois)</li>
          <li>Analyse concurrentielle complète</li>
          <li>Estimations ARR/MRR et signaux marché avancés</li>
          <li>Données de taille de marché</li>
          <li>Export PDF</li>
        </ul>
        <p>
          Les rapports générés sont fournis à titre informatif. Ils s&apos;appuient sur des
          données publiques et des estimations algorithmiques. Le Prestataire ne garantit
          pas l&apos;exactitude, l&apos;exhaustivité ou l&apos;actualité des informations
          fournies.
        </p>
      </Section>

      <Section title="Article 4 — Tarifs et modalités de paiement">
        <p>
          Les prix sont indiqués en euros toutes taxes comprises (TTC). Le Prestataire se
          réserve le droit de modifier ses tarifs à tout moment. Les tarifs applicables
          sont ceux en vigueur au moment de la souscription.
        </p>
        <p>
          Le paiement de l&apos;abonnement Pro s&apos;effectue par carte bancaire via la
          plateforme sécurisée Stripe. Le prélèvement est mensuel et tacitement
          reconductible sauf résiliation par le Client.
        </p>
        <p>
          En cas de défaut de paiement, le Prestataire se réserve le droit de suspendre
          l&apos;accès aux services Pro après notification par email.
        </p>
      </Section>

      <Section title="Article 5 — Souscription et exécution du contrat">
        <p>
          La souscription s&apos;effectue en ligne sur le site nichefounder.com. Le contrat
          est conclu au moment de la validation du paiement de l&apos;abonnement Pro.
        </p>
        <p>
          Le Client reçoit une confirmation par email. L&apos;accès aux services est
          immédiat après validation.
        </p>
      </Section>

      <Section title="Article 6 — Durée, résiliation et renouvellement">
        <p>
          L&apos;abonnement Pro est mensuel, à durée indéterminée, renouvelé automatiquement
          chaque mois. Le Client peut résilier à tout moment depuis son espace client ou en
          contactant{" "}
          <a href="mailto:contact@nichefounder.com" className="text-accent-blue hover:underline">
            contact@nichefounder.com
          </a>
          . La résiliation prend effet à la fin de la période en cours ; aucun
          remboursement au prorata n&apos;est dû pour la période entamée.
        </p>
      </Section>

      <Section title="Article 7 — Droit de rétractation">
        <p>
          Conformément aux articles L.221-18 et suivants du Code de la consommation, le
          Client consommateur dispose d&apos;un délai de 14 jours à compter de la
          souscription pour exercer son droit de rétractation, sans avoir à justifier de
          motifs ni à payer de pénalités.
        </p>
        <p>
          Toutefois, conformément à l&apos;article L.221-28 du Code de la consommation,
          le droit de rétractation ne peut être exercé pour les contenus numériques
          fournis sur un support immatériel dont l&apos;exécution a commencé avec
          l&apos;accord préalable exprès du Client et le renoncement exprès à son droit
          de rétractation. En souscrivant au service et en accédant immédiatement aux
          rapports, le Client accepte expressément cette condition.
        </p>
        <p>
          Pour exercer le droit de rétractation dans les cas applicables, le Client
          peut adresser sa demande à{" "}
          <a href="mailto:contact@nichefounder.com" className="text-accent-blue hover:underline">
            contact@nichefounder.com
          </a>
          .
        </p>
      </Section>

      <Section title="Article 8 — Obligations du Client">
        <p>Le Client s&apos;engage à :</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Fournir des informations exactes lors de la création de son compte.</li>
          <li>Ne pas partager ses identifiants de connexion avec des tiers.</li>
          <li>
            Utiliser le service conformément à sa destination et ne pas procéder à
            d&apos;extractions massives de données (scraping, bots non autorisés).
          </li>
          <li>
            Ne pas revendre, redistribuer ou reproduire les rapports générés sans
            autorisation écrite du Prestataire.
          </li>
        </ul>
      </Section>

      <Section title="Article 9 — Propriété intellectuelle">
        <p>
          L&apos;ensemble des éléments du site Niche Founder (logiciels, algorithmes,
          interface, marque, contenus) sont la propriété exclusive du Prestataire et
          sont protégés par le droit de la propriété intellectuelle.
        </p>
        <p>
          Le Client bénéficie d&apos;une licence d&apos;utilisation personnelle,
          non exclusive et non transférable, limitée à la durée de son abonnement.
        </p>
      </Section>

      <Section title="Article 10 — Responsabilité et garanties">
        <p>
          Le Prestataire met en œuvre tous les moyens raisonnables pour assurer la
          disponibilité du service, sans garantie de disponibilité ininterrompue.
        </p>
        <p>
          Les analyses fournies constituent des aides à la décision et ne sauraient
          engager la responsabilité du Prestataire en cas de décision commerciale prise
          par le Client sur la base de ces données.
        </p>
        <p>
          La responsabilité du Prestataire est limitée, pour toute cause, au montant des
          sommes effectivement versées par le Client au cours des 12 derniers mois.
        </p>
      </Section>

      <Section title="Article 11 — Données personnelles">
        <p>
          Les données personnelles collectées sont traitées conformément au Règlement
          Général sur la Protection des Données (RGPD) et à la loi Informatique et
          Libertés. Pour plus d&apos;informations, consultez notre politique de
          confidentialité ou contactez-nous à{" "}
          <a href="mailto:contact@nichefounder.com" className="text-accent-blue hover:underline">
            contact@nichefounder.com
          </a>
          .
        </p>
      </Section>

      <Section title="Article 12 — Force majeure">
        <p>
          Le Prestataire ne pourra être tenu responsable de l&apos;inexécution de ses
          obligations en cas de force majeure telle que définie par la jurisprudence
          française (panne réseau, catastrophe naturelle, cyberattaque majeure, etc.).
        </p>
      </Section>

      <Section title="Article 13 — Médiation et litiges">
        <p>
          Conformément à l&apos;article L.612-1 du Code de la consommation, le Client
          consommateur peut recourir gratuitement à un médiateur de la consommation en
          vue de la résolution amiable d&apos;un litige. Le médiateur compétent sera
          communiqué sur demande à{" "}
          <a href="mailto:contact@nichefounder.com" className="text-accent-blue hover:underline">
            contact@nichefounder.com
          </a>
          .
        </p>
        <p>
          À défaut de résolution amiable, tout litige relatif à l&apos;interprétation
          ou l&apos;exécution des présentes CGV sera soumis aux tribunaux compétents
          conformément au droit français.
        </p>
      </Section>

      <Section title="Article 14 — Droit applicable">
        <p>
          Les présentes CGV sont soumises au droit français. La langue du contrat est
          le français.
        </p>
      </Section>
    </>
  );
}
