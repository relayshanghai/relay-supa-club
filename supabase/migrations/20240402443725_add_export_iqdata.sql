CREATE TABLE public.export_batches (
  id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
  iq_data_id text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone,
  last_completed_at timestamp without time zone,
  PRIMARY KEY (id)
);

CREATE TABLE public.export_batch_influencers (
  export_batch_id uuid NOT NULL REFERENCES public.export_batches (id),
  iq_data_reference_id text,
  PRIMARY KEY (iq_data_reference_id)
);
