from codecarbon import EmissionsTracker

class TrackerWrapper:
    def __init__(self):
        # We start the tracker with file saving disabled as we want to capture the values in-memory
        self.tracker = EmissionsTracker(log_level="error", save_to_file=False)

    def start(self):
        self.tracker.start()

    def stop(self):
        emissions = self.tracker.stop()
        energy = self.tracker._total_energy.kWh if hasattr(self.tracker, "_total_energy") else 0.0
        if emissions is None:
            emissions = 0.0
        return float(emissions), float(energy)
